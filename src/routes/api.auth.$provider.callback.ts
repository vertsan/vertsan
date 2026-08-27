import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { type ProviderName, providers } from "#/lib/oauth-providers";
import { createOAuthUserService } from "#/services/oauth-user.service";

const SECRET = process.env.ADMIN_SECRET || "vertsan-secret";

function hashState(state: string, secret: string): string {
	return crypto.createHash("sha256").update(`${state}:${secret}`).digest("hex");
}

function getCookie(request: Request, name: string): string | null {
	const cookieHeader = request.headers.get("cookie");
	if (!cookieHeader) return null;
	for (const c of cookieHeader.split(";")) {
		const [k, ...v] = c.trim().split("=");
		if (k === name) return decodeURIComponent(v.join("="));
	}
	return null;
}

function generateToken(userId: number, provider: string): string {
	const ts = Date.now().toString(36);
	const raw = `${userId}:${provider}:${ts}:${SECRET}`;
	const hash = crypto.createHash("sha256").update(raw).digest("hex");
	return `${ts}.${hash}.${userId}.${provider}`;
}

function setAuthCookie(value: string, maxAge: number): string {
	return `testimonials_auth=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export const Route = createFileRoute("/api/auth/$provider/callback")({
	server: {
		handlers: {
			GET: async ({ params, request }) => {
				const providerName = params.provider as ProviderName;
				const provider = providers[providerName];
				const requestUrl = new URL(request.url);
				const baseUrl =
					process.env.BASE_URL || `${requestUrl.protocol}//${requestUrl.host}`;

				if (!provider) {
					return new Response("Unknown provider", { status: 400 });
				}

				const code = requestUrl.searchParams.get("code");
				const returnedState = requestUrl.searchParams.get("state");
				const error = requestUrl.searchParams.get("error");

				if (error) {
					return new Response(null, {
						status: 302,
						headers: { Location: `${baseUrl}/?oauth_error=${error}` },
					});
				}

				if (!code || !returnedState) {
					return new Response(null, {
						status: 302,
						headers: { Location: `${baseUrl}/?oauth_error=missing_params` },
					});
				}

				const storedHash = getCookie(request, `oauth_state_${providerName}`);
				if (!storedHash || hashState(returnedState, SECRET) !== storedHash) {
					return new Response(null, {
						status: 302,
						headers: { Location: `${baseUrl}/?oauth_error=invalid_state` },
					});
				}

				try {
					const redirectUri = `${baseUrl}/api/auth/${providerName}/callback`;
					const tokenData = await provider.exchangeCode(code, redirectUri);
					const userProfile = await provider.fetchUser(tokenData.access_token);

					const oauthUserService = createOAuthUserService();
					const oauthUser = await oauthUserService.findOrCreate(
						providerName,
						String(userProfile.id),
						{
							name: userProfile.name,
							email: userProfile.email,
							avatar: userProfile.avatar,
						},
					);

					const sessionToken = generateToken(oauthUser.id, providerName);

					const headers = new Headers();
					headers.set("Location", `${baseUrl}/`);
					headers.append(
						"Set-Cookie",
						setAuthCookie(sessionToken, 60 * 60 * 24 * 30),
					);
					headers.append(
						"Set-Cookie",
						`oauth_state_${providerName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
					);

					return new Response(null, {
						status: 302,
						headers,
					});
				} catch (err) {
					console.error("OAuth callback error:", err);
					return new Response(null, {
						status: 302,
						headers: {
							Location: `${baseUrl}/?oauth_error=callback_failed`,
						},
					});
				}
			},
		},
	},
});

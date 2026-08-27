import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { type ProviderName, providers } from "#/lib/oauth-providers";

function generateOAuthState(): string {
	return crypto.randomBytes(32).toString("hex");
}

function hashState(state: string, secret: string): string {
	return crypto.createHash("sha256").update(`${state}:${secret}`).digest("hex");
}

export const Route = createFileRoute("/api/auth/$provider")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const providerName = params.provider as ProviderName;
				const provider = providers[providerName];

				if (!provider) {
					return new Response("Unknown provider", { status: 400 });
				}

				if (!provider.getClientId() || !provider.getClientSecret()) {
					return new Response(
						`OAuth not configured for ${provider.name}. Add credentials to .env`,
						{ status: 503 },
					);
				}

				const state = generateOAuthState();
				const secret = process.env.ADMIN_SECRET || "vertsan-secret";
				const stateHash = hashState(state, secret);
				const baseUrl = process.env.BASE_URL || "http://localhost:3000";
				const redirectUri = `${baseUrl}/api/auth/${providerName}/callback`;

				const authUrl = provider.getAuthorizationUrl(redirectUri, state);

				const headers = new Headers();
				headers.set("Location", authUrl);
				headers.append(
					"Set-Cookie",
					`oauth_state_${providerName}=${encodeURIComponent(stateHash)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
				);

				return new Response(null, {
					status: 302,
					headers,
				});
			},
		},
	},
});

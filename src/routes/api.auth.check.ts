import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { createOAuthUserService } from "#/services/oauth-user.service";

const SECRET = process.env.ADMIN_SECRET || "vertsan-secret";

function getCookie(request: Request, name: string): string | null {
	const cookieHeader = request.headers.get("cookie");
	if (!cookieHeader) return null;
	for (const c of cookieHeader.split(";")) {
		const [k, ...v] = c.trim().split("=");
		if (k === name) return decodeURIComponent(v.join("="));
	}
	return null;
}

function verifyToken(
	token: string,
): { userId: number; provider: string } | null {
	try {
		const parts = token.split(".");
		if (parts.length < 4) return null;
		const [ts, hash, userIdStr, provider] = parts;
		if (!ts || !hash || !userIdStr || !provider) return null;
		const raw = `${userIdStr}:${provider}:${ts}:${SECRET}`;
		const expectedHash = crypto.createHash("sha256").update(raw).digest("hex");
		if (hash !== expectedHash) return null;
		return { userId: Number.parseInt(userIdStr, 10), provider };
	} catch {
		return null;
	}
}

export const Route = createFileRoute("/api/auth/check")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const token = getCookie(request, "testimonials_auth");
				if (!token) {
					return Response.json({ authenticated: false });
				}

				const decoded = verifyToken(token);
				if (!decoded) {
					return Response.json({ authenticated: false });
				}

				try {
					const oauthUserService = createOAuthUserService();
					const user = await oauthUserService.findById(decoded.userId);
					if (user) {
						return Response.json({
							authenticated: true,
							user: {
								id: user.id,
								name: user.name,
								email: user.email,
								avatar: user.avatar,
								provider: user.provider,
							},
						});
					}
				} catch {
					// DB unavailable
				}

				return Response.json({ authenticated: false });
			},
		},
	},
});

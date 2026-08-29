import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { createOAuthUserService } from "#/services/oauth-user.service";
import { createTestimonialService } from "#/services/testimonial.service";

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

function getAuthUser(
	request: Request,
): { userId: number; provider: string } | null {
	const token = getCookie(request, "testimonials_auth");
	if (!token) return null;
	return verifyToken(token);
}

export const Route = createFileRoute("/api/testimonials")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const service = createTestimonialService();
					const items = await service.list();
					return Response.json({ items });
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Testimonials API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
			POST: async ({ request }) => {
				try {
					const authUser = getAuthUser(request);
					if (!authUser) {
						return Response.json(
							{ error: "Authentication required" },
							{ status: 401 },
						);
					}

					const body = await request.json();
					const { action, content, testimonialId } = body as {
						action?: string;
						content?: string;
						testimonialId?: number;
					};

					const service = createTestimonialService();

					if (action === "list") {
						const items = await service.listByUser(authUser.userId);
						return Response.json({ items });
					}

					if (action === "create") {
						if (!content || !content.trim()) {
							return Response.json(
								{ error: "Content is required" },
								{ status: 400 },
							);
						}

						if (content.trim().length > 500) {
							return Response.json(
								{ error: "Testimonial must be 500 characters or less" },
								{ status: 400 },
							);
						}

						const oauthUserService = createOAuthUserService();
						const user = await oauthUserService.findById(authUser.userId);
						if (!user) {
							return Response.json(
								{ error: "User not found" },
								{ status: 404 },
							);
						}

						const [created] = await service.create({
							userId: authUser.userId,
							authorName: user.name,
							authorAvatar: user.avatar ?? undefined,
							authorProfileUrl: user.profileUrl ?? undefined,
							provider: authUser.provider,
							content: content.trim(),
						});

						return Response.json({ item: created });
					}

					if (action === "delete") {
						if (!testimonialId) {
							return Response.json(
								{ error: "testimonialId is required" },
								{ status: 400 },
							);
						}

						const deleted = await service.remove(
							testimonialId,
							authUser.userId,
						);
						if (!deleted) {
							return Response.json(
								{ error: "Not found or not authorized" },
								{ status: 404 },
							);
						}
						return Response.json({ success: true });
					}

					return Response.json({ error: "Unknown action" }, { status: 400 });
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Testimonials API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

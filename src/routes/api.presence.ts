import { createFileRoute } from "@tanstack/react-router";
import { createVisitorService } from "#/services/visitor.service";

const MAX_SESSION_LENGTH = 128;

export const Route = createFileRoute("/api/presence")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const { sessionId, event, name } = body as {
						sessionId?: unknown;
						event?: unknown;
						name?: unknown;
					};

					if (
						typeof sessionId !== "string" ||
						sessionId.length === 0 ||
						sessionId.length > MAX_SESSION_LENGTH
					) {
						return Response.json(
							{ error: "Invalid sessionId" },
							{ status: 400 },
						);
					}

					const kind = event === "view" ? "view" : "heartbeat";
					const cleanName =
						typeof name === "string" && name.trim()
							? name.trim().slice(0, 60)
							: null;
					const service = createVisitorService();
					const result = await service.track({
						sessionId,
						event: kind,
						name: cleanName,
					});

					return Response.json({
						online: result.online,
						totalViews: result.totalViews,
						onlineUsers: result.onlineUsers,
						recentViews: result.recentViews,
					});
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Presence API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

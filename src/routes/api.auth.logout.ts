import { createFileRoute } from "@tanstack/react-router";

function clearCookie(): string {
	return "testimonials_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

export const Route = createFileRoute("/api/auth/logout")({
	server: {
		handlers: {
			POST: async () => {
				return new Response(JSON.stringify({ success: true }), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Set-Cookie": clearCookie(),
					},
				});
			},
		},
	},
});

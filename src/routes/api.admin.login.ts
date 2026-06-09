import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function hashToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken(password: string): string {
	const ts = Date.now().toString(36);
	const raw = `${password}:${ts}:${process.env.ADMIN_SECRET || "vertsan-secret"}`;
	return `${ts}.${hashToken(raw)}`;
}

function verifyToken(token: string): boolean {
	try {
		const [ts, hash] = token.split(".");
		if (!ts || !hash) return false;
		const raw = `${ADMIN_PASSWORD}:${ts}:${process.env.ADMIN_SECRET || "vertsan-secret"}`;
		return hash === hashToken(raw);
	} catch {
		return false;
	}
}

export const Route = createFileRoute("/api/admin/login")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const { action, password } = body;

					if (action === "check") {
						const cookieHeader = request.headers.get("cookie") || "";
						const cookies = Object.fromEntries(
							cookieHeader.split(";").map((c) => {
								const [k, ...v] = c.trim().split("=");
								return [k, v.join("=")];
							}),
						);
						const token = cookies["admin_auth"];
						const isAuthed = token
							? verifyToken(decodeURIComponent(token))
							: false;
						return Response.json({ authenticated: isAuthed });
					}

					if (action === "login") {
						if (password !== ADMIN_PASSWORD) {
							return Response.json(
								{ error: "Invalid password" },
								{ status: 401 },
							);
						}

						const token = generateToken(password);

						return new Response(JSON.stringify({ success: true }), {
							status: 200,
							headers: {
								"Content-Type": "application/json",
								"Set-Cookie": `admin_auth=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
							},
						});
					}

					if (action === "logout") {
						return new Response(JSON.stringify({ success: true }), {
							status: 200,
							headers: {
								"Content-Type": "application/json",
								"Set-Cookie":
									"admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
							},
						});
					}

					return Response.json({ error: "Unknown action" }, { status: 400 });
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

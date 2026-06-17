import crypto from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "#/db";
import { users } from "#/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.ADMIN_SECRET || "vertsan-secret";

// ── Password hashing (scrypt) ──────────────────────────────────────────
function hashPassword(password: string): string {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
	const [salt, hash] = stored.split(":");
	if (!salt || !hash) return false;
	const verify = crypto.scryptSync(password, salt, 64).toString("hex");
	return hash === verify;
}

// ── Token helpers ──────────────────────────────────────────────────────
function hashToken(raw: string): string {
	return crypto.createHash("sha256").update(raw).digest("hex");
}

function generateToken(userId: number, role: string): string {
	const ts = Date.now().toString(36);
	const raw = `${userId}:${role}:${ts}:${SECRET}`;
	return `${ts}.${hashToken(raw)}.${userId}.${role}`;
}

function verifyAndDecodeToken(token: string): { userId: number; role: string } | null {
	try {
		const parts = token.split(".");
		if (parts.length < 4) return null;
		const [ts, hash, userIdStr, role] = parts;
		if (!ts || !hash || !userIdStr || !role) return null;
		const raw = `${userIdStr}:${role}:${ts}:${SECRET}`;
		if (hash !== hashToken(raw)) return null;
		return { userId: Number.parseInt(userIdStr, 10), role };
	} catch {
		return null;
	}
}

// ── Helpers ────────────────────────────────────────────────────────────
function getCookie(request: Request, name: string): string | null {
	const cookieHeader = request.headers.get("cookie");
	if (!cookieHeader) return null;
	for (const c of cookieHeader.split(";")) {
		const [k, ...v] = c.trim().split("=");
		if (k === name) return decodeURIComponent(v.join("="));
	}
	return null;
}

function setCookie(value: string, maxAge: number): string {
	return `admin_auth=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearCookie(): string {
	return "admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

interface DbUser {
	id: number;
	username: string;
	name: string;
	role: string;
	password: string;
}

async function lookupUser(username: string): Promise<DbUser | null> {
	try {
		const db = getDb();
		const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
		return result[0] ?? null;
	} catch {
		return null;
	}
}

async function hasUsers(): Promise<boolean> {
	try {
		const db = getDb();
		const result = await db.select({ id: users.id }).from(users).limit(1);
		return result.length > 0;
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
					const { action, username, password } = body as {
						action: string;
						username?: string;
						password?: string;
					};

					// ── CHECK ──────────────────────────────────────────────────
					if (action === "check") {
						const token = getCookie(request, "admin_auth");
						if (!token) {
							return Response.json({ authenticated: false });
						}
						const decoded = verifyAndDecodeToken(token);
						if (!decoded) {
							return Response.json({ authenticated: false });
						}

						// Lookup user to return current info
						try {
							const db = getDb();
							const result = await db
								.select({ id: users.id, username: users.username, name: users.name, role: users.role })
								.from(users)
								.where(eq(users.id, decoded.userId))
								.limit(1);
							if (result[0]) {
								return Response.json({ authenticated: true, user: result[0] });
							}
						} catch {
							// DB unavailable — legacy check
						}

						// Legacy fallback: just return authenticated if token is valid
						return Response.json({ authenticated: true, user: { id: 0, username: "admin", name: "Admin", role: decoded.role } });
					}

					// ── LOGIN ──────────────────────────────────────────────────
					if (action === "login") {
						if (!username || !password) {
							return Response.json({ error: "Username and password required" }, { status: 400 });
						}

						// Try DB-based auth first
						const dbUser = await lookupUser(username);
						if (dbUser) {
							if (!verifyPassword(password, dbUser.password)) {
								return Response.json({ error: "Invalid credentials" }, { status: 401 });
							}
							const token = generateToken(dbUser.id, dbUser.role);
							const user = { id: dbUser.id, username: dbUser.username, name: dbUser.name, role: dbUser.role };
							return new Response(JSON.stringify({ success: true, user }), {
								status: 200,
								headers: { "Content-Type": "application/json", "Set-Cookie": setCookie(token, 60 * 60 * 24 * 7) },
							});
						}

						// Legacy env-based fallback (if no users in DB yet)
						const hasExistingUsers = await hasUsers();
						if (!hasExistingUsers && username === "admin" && password === ADMIN_PASSWORD) {
							const token = generateToken(0, "admin");
							const user = { id: 0, username: "admin", name: "Admin", role: "admin" as const };
							return new Response(JSON.stringify({ success: true, user }), {
								status: 200,
								headers: { "Content-Type": "application/json", "Set-Cookie": setCookie(token, 60 * 60 * 24 * 7) },
							});
						}

						return Response.json({ error: "Invalid credentials" }, { status: 401 });
					}

					// ── REGISTER (create first admin user) ─────────────────────
					if (action === "register") {
						if (!username || !password) {
							return Response.json({ error: "Username and password required" }, { status: 400 });
						}
						const existing = await hasUsers();
						if (existing) {
							return Response.json({ error: "Users already exist. Contact an admin." }, { status: 403 });
						}
						try {
							const db = getDb();
							const hashed = hashPassword(password);
							const [created] = await db.insert(users).values({
								username,
								password: hashed,
								name: username === "admin" ? "Admin" : username,
								role: "admin",
							}).returning({ id: users.id, username: users.username, name: users.name, role: users.role });
							const token = generateToken(created.id, created.role);
							return new Response(JSON.stringify({ success: true, user: created }), {
								status: 200,
								headers: { "Content-Type": "application/json", "Set-Cookie": setCookie(token, 60 * 60 * 24 * 7) },
							});
						} catch {
							return Response.json({ error: "Failed to create user. Database may not be available." }, { status: 500 });
						}
					}

					// ── LOGOUT ─────────────────────────────────────────────────
					if (action === "logout") {
						return new Response(JSON.stringify({ success: true }), {
							status: 200,
							headers: { "Content-Type": "application/json", "Set-Cookie": clearCookie() },
						});
					}

					return Response.json({ error: "Unknown action" }, { status: 400 });
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Login API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

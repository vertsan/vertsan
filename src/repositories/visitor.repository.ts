import { and, asc, desc, eq, gt, sql } from "drizzle-orm";
import { type DbInstance, getDb } from "#/db/index";
import { siteStats, visitorSessions } from "#/db/schema";

export function createVisitorRepository(dbInstance: DbInstance = getDb()) {
	async function upsertSession(
		sessionId: string,
		seenAt = new Date(),
		name?: string | null,
	) {
		const cleanName = name !== null && name !== undefined ? name.trim() : "";
		const existing = await dbInstance
			.select({ id: visitorSessions.id })
			.from(visitorSessions)
			.where(eq(visitorSessions.sessionId, sessionId))
			.limit(1)
			.then((rows) => rows[0] ?? null);

		if (existing) {
			await dbInstance
				.update(visitorSessions)
				.set({
					lastSeenAt: seenAt,
					...(cleanName ? { name: cleanName } : {}),
				})
				.where(eq(visitorSessions.id, existing.id));
			return { created: false };
		}

		await dbInstance
			.insert(visitorSessions)
			.values({
				sessionId,
				name: cleanName || null,
				firstSeenAt: seenAt,
				lastSeenAt: seenAt,
			})
			.onConflictDoNothing({ target: visitorSessions.sessionId });
		return { created: true };
	}

	function countOnline(since: Date) {
		return dbInstance
			.select({ count: sql<number>`count(*)::int` })
			.from(visitorSessions)
			.where(gt(visitorSessions.lastSeenAt, since))
			.then((rows) => rows[0]?.count ?? 0);
	}

	function findOnlineUsers(since: Date) {
		return dbInstance
			.select({
				name: visitorSessions.name,
				lastSeenAt: visitorSessions.lastSeenAt,
			})
			.from(visitorSessions)
			.where(gt(visitorSessions.lastSeenAt, since))
			.orderBy(desc(visitorSessions.lastSeenAt));
	}

	function findRecentViews(limit = 8) {
		return dbInstance
			.select({
				name: visitorSessions.name,
				firstSeenAt: visitorSessions.firstSeenAt,
			})
			.from(visitorSessions)
			.orderBy(desc(visitorSessions.firstSeenAt))
			.limit(limit);
	}

	function getStats() {
		return dbInstance
			.select()
			.from(siteStats)
			.orderBy(asc(siteStats.id))
			.limit(1)
			.then((rows) => rows[0] ?? null);
	}

	async function incrementViews() {
		const row = await getStats();
		if (row) {
			await dbInstance
				.update(siteStats)
				.set({
					totalViews: sql`${siteStats.totalViews} + 1`,
					updatedAt: new Date(),
				})
				.where(and(eq(siteStats.id, row.id)));
			return row.totalViews + 1;
		}
		const [created] = await dbInstance
			.insert(siteStats)
			.values({ totalViews: 1 })
			.returning();
		return created.totalViews;
	}

	return {
		upsertSession,
		countOnline,
		findOnlineUsers,
		findRecentViews,
		getStats,
		incrementViews,
	};
}

import { and, eq } from "drizzle-orm";
import { type DbInstance, getDb } from "#/db/index";
import { oauthUsers } from "#/db/schema";

export type OAuthUser = typeof oauthUsers.$inferSelect;
export type NewOAuthUser = typeof oauthUsers.$inferInsert;

export function createOAuthUserRepository(dbInstance: DbInstance = getDb()) {
	function findByProvider(provider: string, providerId: string) {
		return dbInstance
			.select()
			.from(oauthUsers)
			.where(
				and(
					eq(oauthUsers.provider, provider),
					eq(oauthUsers.providerId, providerId),
				),
			)
			.then((r) => r[0] ?? null);
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(oauthUsers)
			.where(eq(oauthUsers.id, id))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewOAuthUser) {
		return dbInstance.insert(oauthUsers).values(data).returning();
	}

	function update(
		id: number,
		data: Partial<
			Pick<NewOAuthUser, "name" | "email" | "avatar" | "profileUrl" | "updatedAt">
		>,
	) {
		return dbInstance
			.update(oauthUsers)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(oauthUsers.id, id))
			.returning();
	}

	return { findByProvider, findById, create, update };
}

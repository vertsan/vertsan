import { eq } from "drizzle-orm";
import { type DbInstance, db } from "#/db/index";
import { technologies } from "#/db/schema";

export type Technology = typeof technologies.$inferSelect;
export type NewTechnology = typeof technologies.$inferInsert;

export function createTechnologyRepository(dbInstance: DbInstance = db) {
	function findAll() {
		return dbInstance
			.select()
			.from(technologies)
			.orderBy(technologies.category);
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(technologies)
			.where(eq(technologies.id, id))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewTechnology) {
		return dbInstance.insert(technologies).values(data).returning();
	}

	function update(id: number, data: Partial<NewTechnology>) {
		return dbInstance
			.update(technologies)
			.set(data)
			.where(eq(technologies.id, id))
			.returning();
	}

	function remove(id: number) {
		return dbInstance.delete(technologies).where(eq(technologies.id, id));
	}

	return { findAll, findById, create, update, remove };
}

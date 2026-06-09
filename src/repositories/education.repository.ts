import { eq } from "drizzle-orm";
import { getDb, type DbInstance } from "#/db/index";
import { education } from "#/db/schema";

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

export function createEducationRepository(dbInstance: DbInstance = getDb()) {
	function findAll() {
		return dbInstance.select().from(education).orderBy(education.startDate);
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(education)
			.where(eq(education.id, id))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewEducation) {
		return dbInstance.insert(education).values(data).returning();
	}

	function update(id: number, data: Partial<NewEducation>) {
		return dbInstance
			.update(education)
			.set(data)
			.where(eq(education.id, id))
			.returning();
	}

	function remove(id: number) {
		return dbInstance.delete(education).where(eq(education.id, id));
	}

	return { findAll, findById, create, update, remove };
}

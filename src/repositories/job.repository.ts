import { eq } from "drizzle-orm";
import { type DbInstance, db } from "#/db/index";
import { jobs } from "#/db/schema";

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export function createJobRepository(dbInstance: DbInstance = db) {
	function findAll() {
		return dbInstance.select().from(jobs).orderBy(jobs.startDate);
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(jobs)
			.where(eq(jobs.id, id))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewJob) {
		return dbInstance.insert(jobs).values(data).returning();
	}

	function update(id: number, data: Partial<NewJob>) {
		return dbInstance.update(jobs).set(data).where(eq(jobs.id, id)).returning();
	}

	function remove(id: number) {
		return dbInstance.delete(jobs).where(eq(jobs.id, id));
	}

	return { findAll, findById, create, update, remove };
}

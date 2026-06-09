import { eq } from "drizzle-orm";
import { getDb, type DbInstance } from "#/db/index";
import { projects } from "#/db/schema";

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export function createProjectRepository(dbInstance: DbInstance = getDb()) {
	function findAll() {
		return dbInstance.select().from(projects).orderBy(projects.startDate);
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(projects)
			.where(eq(projects.id, id))
			.then((r) => r[0] ?? null);
	}

	function findBySlug(slug: string) {
		return dbInstance
			.select()
			.from(projects)
			.where(eq(projects.slug, slug))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewProject) {
		return dbInstance.insert(projects).values(data).returning();
	}

	function update(id: number, data: Partial<NewProject>) {
		return dbInstance
			.update(projects)
			.set(data)
			.where(eq(projects.id, id))
			.returning();
	}

	function remove(id: number) {
		return dbInstance.delete(projects).where(eq(projects.id, id));
	}

	return { findAll, findById, findBySlug, create, update, remove };
}

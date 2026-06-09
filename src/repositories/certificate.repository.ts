import { eq } from "drizzle-orm";
import { getDb, type DbInstance } from "#/db/index";
import { certificates } from "#/db/schema";

export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;

export function createCertificateRepository(dbInstance: DbInstance = getDb()) {
	function findAll() {
		return dbInstance.select().from(certificates).orderBy(certificates.date);
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(certificates)
			.where(eq(certificates.id, id))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewCertificate) {
		return dbInstance.insert(certificates).values(data).returning();
	}

	function update(id: number, data: Partial<NewCertificate>) {
		return dbInstance
			.update(certificates)
			.set(data)
			.where(eq(certificates.id, id))
			.returning();
	}

	function remove(id: number) {
		return dbInstance.delete(certificates).where(eq(certificates.id, id));
	}

	return { findAll, findById, create, update, remove };
}

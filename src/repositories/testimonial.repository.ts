import { desc, eq } from "drizzle-orm";
import { type DbInstance, getDb } from "#/db/index";
import { testimonials } from "#/db/schema";

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export function createTestimonialRepository(dbInstance: DbInstance = getDb()) {
	function findApproved() {
		return dbInstance
			.select()
			.from(testimonials)
			.where(eq(testimonials.approved, true))
			.orderBy(desc(testimonials.createdAt));
	}

	function findByUser(userId: number) {
		return dbInstance
			.select()
			.from(testimonials)
			.where(eq(testimonials.userId, userId))
			.orderBy(desc(testimonials.createdAt));
	}

	function findById(id: number) {
		return dbInstance
			.select()
			.from(testimonials)
			.where(eq(testimonials.id, id))
			.then((r) => r[0] ?? null);
	}

	function create(data: NewTestimonial) {
		return dbInstance.insert(testimonials).values(data).returning();
	}

	function remove(id: number) {
		return dbInstance.delete(testimonials).where(eq(testimonials.id, id));
	}

	return { findApproved, findByUser, findById, create, remove };
}

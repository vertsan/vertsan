import {
	createTestimonialRepository,
	type NewTestimonial,
} from "#/repositories/testimonial.repository";

export function createTestimonialService() {
	const repo = createTestimonialRepository();

	function list() {
		return repo.findApproved();
	}

	function listByUser(userId: number) {
		return repo.findByUser(userId);
	}

	function create(data: {
		userId: number;
		authorName: string;
		authorAvatar?: string;
		authorProfileUrl?: string;
		provider: string;
		content: string;
	}) {
		const input: NewTestimonial = {
			userId: data.userId,
			authorName: data.authorName,
			authorAvatar: data.authorAvatar ?? null,
			authorProfileUrl: data.authorProfileUrl ?? null,
			provider: data.provider,
			content: data.content,
		};
		return repo.create(input);
	}

	async function remove(id: number, userId: number) {
		const existing = await repo.findById(id);
		if (!existing) return null;
		if (existing.userId !== userId) return null;
		await repo.remove(id);
		return existing;
	}

	return { list, listByUser, create, remove };
}

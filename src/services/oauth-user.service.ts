import {
	createOAuthUserRepository,
	type NewOAuthUser,
} from "#/repositories/oauth-user.repository";

export function createOAuthUserService() {
	const repo = createOAuthUserRepository();

	async function findOrCreate(
		provider: string,
		providerId: string,
		profile: {
			name: string;
			email?: string;
			avatar?: string;
			profileUrl?: string;
		},
	) {
		const existing = await repo.findByProvider(provider, providerId);
		if (existing) {
			const updated = await repo.update(existing.id, {
				name: profile.name,
				email: profile.email ?? existing.email,
				avatar: profile.avatar ?? existing.avatar,
				profileUrl: profile.profileUrl ?? existing.profileUrl,
			});
			return updated[0] ?? existing;
		}

		const input: NewOAuthUser = {
			provider,
			providerId,
			name: profile.name,
			email: profile.email ?? null,
			avatar: profile.avatar ?? null,
			profileUrl: profile.profileUrl ?? null,
		};
		const [created] = await repo.create(input);
		return created;
	}

	function findById(id: number) {
		return repo.findById(id);
	}

	return { findOrCreate, findById };
}

import type { VisitorCountry } from "#/lib/geo";
import { createVisitorRepository } from "#/repositories/visitor.repository";
import { createVisitorCountryRepository } from "#/repositories/visitor-country.repository";

const ONLINE_WINDOW_MS = 90_000;

export function createVisitorService() {
	const repo = createVisitorRepository();
	const countryRepo = createVisitorCountryRepository();

	async function track({
		sessionId,
		event,
		name,
		country,
	}: {
		sessionId: string;
		event: "view" | "heartbeat";
		name?: string | null;
		country?: VisitorCountry;
	}) {
		const seenAt = new Date();
		const { created } = await repo.upsertSession(sessionId, seenAt, name);

		if (country) {
			// Country stats are best-effort and must never break presence tracking.
			await countryRepo
				.record(country.code, country.name, {
					newVisitor: created,
					view: event === "view" || created,
				})
				.catch((err) => console.error("Country tracking error:", err));
		}

		let totalViews: number | null = null;
		if (event === "view" || created) {
			totalViews = await repo.incrementViews();
		} else {
			const stats = await repo.getStats();
			totalViews = stats?.totalViews ?? 0;
		}

		const onlineUsers = await repo.findOnlineUsers(
			new Date(Date.now() - ONLINE_WINDOW_MS),
		);
		const recentViews = await repo.findRecentViews();
		const online = onlineUsers.length;

		return { online, totalViews, onlineUsers, recentViews };
	}

	async function summary() {
		const onlineUsers = await repo.findOnlineUsers(
			new Date(Date.now() - ONLINE_WINDOW_MS),
		);
		const stats = await repo.getStats();
		const recentViews = await repo.findRecentViews();
		return {
			online: onlineUsers.length,
			totalViews: stats?.totalViews ?? 0,
			onlineUsers,
			recentViews,
		};
	}

	function countries() {
		return countryRepo.findAll();
	}

	return { track, summary, countries };
}

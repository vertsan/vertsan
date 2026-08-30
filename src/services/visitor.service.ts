import { createVisitorRepository } from "#/repositories/visitor.repository";

const ONLINE_WINDOW_MS = 90_000;

export function createVisitorService() {
	const repo = createVisitorRepository();

	async function track({
		sessionId,
		event,
		name,
	}: {
		sessionId: string;
		event: "view" | "heartbeat";
		name?: string | null;
	}) {
		const seenAt = new Date();
		const { created } = await repo.upsertSession(sessionId, seenAt, name);

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

	return { track, summary };
}

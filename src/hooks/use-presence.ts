import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "vrt_session";
const NAME_KEY = "vrt_name";
const HEARTBEAT_MS = 30_000;

export type PresenceUser = {
	name: string | null;
	lastSeenAt: Date;
};

export type PresenceView = {
	name: string | null;
	firstSeenAt: Date;
};

type PresenceResponse = {
	online: number;
	totalViews: number;
	onlineUsers: { name: string | null; lastSeenAt: string | Date }[];
	recentViews: { name: string | null; firstSeenAt: string | Date }[];
};

function getSessionId(): string {
	if (typeof window === "undefined") return "";
	try {
		let id = window.localStorage.getItem(SESSION_KEY);
		if (!id) {
			id =
				typeof crypto.randomUUID === "function"
					? crypto.randomUUID()
					: `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			window.localStorage.setItem(SESSION_KEY, id);
		}
		return id;
	} catch {
		return "";
	}
}

async function ping(
	sessionId: string,
	event: "view" | "heartbeat",
	name: string | null,
) {
	if (!sessionId) return null;
	try {
		const res = await fetch("/api/presence", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionId, event, name }),
		});
		if (!res.ok) return null;
		const data = (await res.json()) as PresenceResponse;
		return {
			online: data.online,
			totalViews: data.totalViews,
			onlineUsers: (data.onlineUsers ?? []).map((u) => ({
				name: u.name,
				lastSeenAt: new Date(u.lastSeenAt),
			})) satisfies PresenceUser[],
			recentViews: (data.recentViews ?? []).map((v) => ({
				name: v.name,
				firstSeenAt: new Date(v.firstSeenAt),
			})) satisfies PresenceView[],
		};
	} catch {
		return null;
	}
}

export function usePresence() {
	const [online, setOnline] = useState<number | null>(null);
	const [totalViews, setTotalViews] = useState<number | null>(null);
	const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
	const [recentViews, setRecentViews] = useState<PresenceView[]>([]);
	const sessionRef = useRef<string | null>(null);
	const viewSentRef = useRef(false);

	const send = useCallback(() => {
		const sessionId = sessionRef.current ?? "";
		if (!sessionId) return;
		const name = window.localStorage.getItem(NAME_KEY);
		void ping(sessionId, "heartbeat", name).then((data) => {
			if (data) {
				setOnline(data.online);
				setTotalViews(data.totalViews);
				setOnlineUsers(data.onlineUsers);
				setRecentViews(data.recentViews);
			}
		});
	}, []);

	useEffect(() => {
		const sessionId = getSessionId();
		sessionRef.current = sessionId;
		const name = window.localStorage.getItem(NAME_KEY);

		// Count a view once per page load.
		if (!viewSentRef.current) {
			viewSentRef.current = true;
			void ping(sessionId, "view", name).then((data) => {
				if (data) {
					setOnline(data.online);
					setTotalViews(data.totalViews);
					setOnlineUsers(data.onlineUsers);
					setRecentViews(data.recentViews);
				}
			});
		}

		send();

		const interval = setInterval(send, HEARTBEAT_MS);

		const onVisibility = () => {
			if (document.visibilityState === "visible") send();
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [send]);

	return { online, totalViews, onlineUsers, recentViews };
}

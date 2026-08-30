import { Clock, Eye, UserRound, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
	type PresenceUser,
	type PresenceView,
	usePresence,
} from "../hooks/use-presence";

const NAME_KEY = "vrt_name";

function formatCount(value: number | null): string {
	if (value === null) return "–";
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return value.toLocaleString("en-US");
}

function timeAgo(date: Date): string {
	const diff = Math.max(0, Date.now() - date.getTime());
	const s = Math.floor(diff / 1000);
	if (s < 60) return "just now";
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}

function displayName(name: string | null): string {
	return name?.trim() ? name : "Guest";
}

export default function PresenceBadge() {
	const { online, totalViews, onlineUsers, recentViews } = usePresence();
	const [active, setActive] = useState<"online" | "views" | null>(null);
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState("");
	const name = useRef<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		name.current = window.localStorage.getItem(NAME_KEY);
	}, []);

	useEffect(() => {
		if (editing) inputRef.current?.focus();
	}, [editing]);

	const commitName = () => {
		const value = draft.trim().slice(0, 60);
		window.localStorage.setItem(NAME_KEY, value);
		name.current = value || null;
		setEditing(false);
	};

	const openEdit = () => {
		setDraft(name.current ?? "");
		setEditing(true);
		setActive(null);
	};

	const renderUser = (u: PresenceUser) => (
		<li
			key={u.lastSeenAt.getTime()}
			className="flex items-center justify-between gap-4 py-0.5 text-xs"
		>
			<span className="flex items-center gap-1.5 truncate text-foreground">
				<UserRound className="size-3 shrink-0 text-muted-foreground" />
				{displayName(u.name)}
			</span>
			<span className="shrink-0 text-muted-foreground">
				{timeAgo(u.lastSeenAt)}
			</span>
		</li>
	);

	const renderView = (v: PresenceView) => (
		<li
			key={v.firstSeenAt.getTime()}
			className="flex items-center justify-between gap-4 py-0.5 text-xs"
		>
			<span className="flex items-center gap-1.5 truncate text-foreground">
				<UserRound className="size-3 shrink-0 text-muted-foreground" />
				{displayName(v.name)}
			</span>
			<span className="flex items-center gap-1 shrink-0 text-muted-foreground">
				<Clock className="size-3" />
				{timeAgo(v.firstSeenAt)}
			</span>
		</li>
	);

	return (
		<div className="relative hidden items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1.5 text-sm shadow-sm lg:flex">
			{/* Name / identity */}
			{editing ? (
				<input
					ref={inputRef}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onBlur={commitName}
					onKeyDown={(e) => {
						if (e.key === "Enter") commitName();
					}}
					placeholder="Your name"
					maxLength={60}
					className="w-24 rounded-md border border-border bg-background px-1.5 py-0.5 text-xs text-foreground outline-none"
				/>
			) : (
				<button
					type="button"
					onClick={openEdit}
					title={name.current ? `You are ${name.current}` : "Set your name"}
					className="header-chip max-w-20 truncate px-2 py-0.5 text-xs"
				>
					{displayName(name.current)}
				</button>
			)}

			<span aria-hidden className="h-3 w-px bg-border" />

			{/* Online users */}
			<button
				type="button"
				onMouseEnter={() => setActive("online")}
				onMouseLeave={() => setActive(null)}
				onClick={() => setActive(active === "online" ? null : "online")}
				className="header-chip gap-1.5 px-2 py-1"
			>
				<span className="relative flex h-2 w-2">
					<span
						aria-hidden
						className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
					/>
					<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
				</span>
				<Users className="size-3.5" />
				<span className="font-medium tabular-nums text-foreground">
					{formatCount(online)}
				</span>
			</button>

			{/* Views */}
			<button
				type="button"
				onMouseEnter={() => setActive("views")}
				onMouseLeave={() => setActive(null)}
				onClick={() => setActive(active === "views" ? null : "views")}
				className="header-chip gap-1.5 px-2 py-1"
			>
				<Eye className="size-3.5" />
				<span className="font-medium tabular-nums text-foreground">
					{formatCount(totalViews)}
				</span>
			</button>

			{/* Tooltip */}
			{active === "online" && (
				<div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-xl">
					<p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
						Online now
					</p>
					{onlineUsers.length === 0 ? (
						<p className="px-1 py-1 text-xs text-muted-foreground">No one</p>
					) : (
						<ul className="max-h-40 divide-y divide-border/50 overflow-y-auto">
							{onlineUsers.map(renderUser)}
						</ul>
					)}
				</div>
			)}

			{active === "views" && (
				<div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-xl">
					<p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
						Recent views
					</p>
					{recentViews.length === 0 ? (
						<p className="px-1 py-1 text-xs text-muted-foreground">
							No views yet
						</p>
					) : (
						<ul className="max-h-40 divide-y divide-border/50 overflow-y-auto">
							{recentViews.map(renderView)}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}

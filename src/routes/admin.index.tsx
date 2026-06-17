import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	Award,
	Briefcase,
	Cpu,
	FolderKanban,
	GraduationCap,
	Loader2,
	Clock,
	Eye,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import StatCard from "#/components/admin/StatCard";
import AnalyticsChart from "#/components/admin/AnalyticsChart";
import QuickActions from "#/components/admin/QuickActions";
import GrowthChart from "#/components/admin/GrowthChart";
import MonthlyActivity from "#/components/admin/MonthlyActivity";
import { useAuth } from "#/lib/admin/auth-context";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

interface CollectionStats {
	jobs: number;
	education: number;
	projects: number;
	certificates: number;
	technologies: number;
}

interface RecentItem {
	id: number;
	title: string;
	collection: string;
	updatedAt: string;
}

function timeAgo(dateStr: string): string {
	const now = Date.now();
	const then = new Date(dateStr).getTime();
	const diffMs = now - then;
	const mins = Math.floor(diffMs / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString();
}

const collectionMeta = [
	{
		key: "jobs",
		label: "Jobs",
		to: "/admin/jobs",
		icon: Briefcase,
		desc: "Professional experience entries",
		color: {
			bg: "from-blue-500/20 to-blue-600/10",
			iconBg: "bg-blue-50 dark:bg-blue-500/10",
			iconColor: "text-blue-600 dark:text-blue-400",
			sparkline: "#60a5fa",
			sparklineFill: "rgba(96,165,250,0.3)",
		},
		pastel: "#60a5fa",
	},
	{
		key: "education",
		label: "Education",
		to: "/admin/education",
		icon: GraduationCap,
		desc: "Academic background",
		color: {
			bg: "from-emerald-500/20 to-emerald-600/10",
			iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
			iconColor: "text-emerald-600 dark:text-emerald-400",
			sparkline: "#34d399",
			sparklineFill: "rgba(52,211,153,0.3)",
		},
		pastel: "#34d399",
	},
	{
		key: "projects",
		label: "Projects",
		to: "/admin/projects",
		icon: FolderKanban,
		desc: "Portfolio projects",
		color: {
			bg: "from-violet-500/20 to-violet-600/10",
			iconBg: "bg-violet-50 dark:bg-violet-500/10",
			iconColor: "text-violet-600 dark:text-violet-400",
			sparkline: "#a78bfa",
			sparklineFill: "rgba(167,139,250,0.3)",
		},
		pastel: "#a78bfa",
	},
	{
		key: "certificates",
		label: "Certificates",
		to: "/admin/certificates",
		icon: Award,
		desc: "Certifications & achievements",
		color: {
			bg: "from-amber-500/20 to-amber-600/10",
			iconBg: "bg-amber-50 dark:bg-amber-500/10",
			iconColor: "text-amber-600 dark:text-amber-400",
			sparkline: "#fbbf24",
			sparklineFill: "rgba(251,191,36,0.3)",
		},
		pastel: "#fbbf24",
	},
	{
		key: "technologies",
		label: "Technologies",
		to: "/admin/technologies",
		icon: Cpu,
		desc: "Tech stack categories",
		color: {
			bg: "from-rose-500/20 to-rose-600/10",
			iconBg: "bg-rose-50 dark:bg-rose-500/10",
			iconColor: "text-rose-600 dark:text-rose-400",
			sparkline: "#fb7185",
			sparklineFill: "rgba(251,113,133,0.3)",
		},
		pastel: "#fb7185",
	},
];

function generateSparkline(): number[] {
	return Array.from({ length: 12 }, () => Math.floor(Math.random() * 5) + 1);
}

const stagger = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.06 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
	},
};

function AdminDashboard() {
	const { isAdmin } = useAuth();
	const [stats, setStats] = useState<CollectionStats | null>(null);
	const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchAll() {
			try {
				const results = await Promise.all(
					collectionMeta.map((m) =>
						fetch("/api/admin", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ collection: m.key, action: "list" }),
						}).then((r) => r.json()),
					),
				);

				const counts: CollectionStats = {
					jobs: (results[0].items || []).length,
					education: (results[1].items || []).length,
					projects: (results[2].items || []).length,
					certificates: (results[3].items || []).length,
					technologies: (results[4].items || []).length,
				};
				setStats(counts);

				const allItems: RecentItem[] = [];
				results.forEach((res, idx) => {
					const key = collectionMeta[idx].key;
					const label = collectionMeta[idx].label;
					(res.items || []).forEach((item: { id: number; title?: string; jobTitle?: string; school?: string; name?: string; updatedAt: string }) => {
						const title = item.title || item.jobTitle || item.school || item.name || `Untitled ${label}`;
						allItems.push({
							id: item.id,
							title,
							collection: key,
							updatedAt: item.updatedAt,
						});
					});
				});
				allItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
				setRecentItems(allItems.slice(0, 5));
			} catch {
				setStats({ jobs: 0, education: 0, projects: 0, certificates: 0, technologies: 0 });
			} finally {
				setLoading(false);
			}
		}

		fetchAll();
	}, []);

	const total = stats
		? Object.values(stats).reduce((a, b) => a + b, 0)
		: 0;

	const chartData = stats
		? collectionMeta
				.map((m) => ({
					name: m.label,
					value: stats[m.key as keyof CollectionStats],
					color: m.pastel,
				}))
				.filter((d) => d.value > 0)
		: [];

	const collectionLabels: Record<string, string> = {
		jobs: "Jobs",
		education: "Education",
		projects: "Projects",
		certificates: "Certificates",
		technologies: "Technologies",
	};

	const categoryBadge: Record<string, string> = {
		jobs: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
		education: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
		projects: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
		certificates: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
		technologies: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
	};

	return (
		<motion.div className="max-w-6xl space-y-8" variants={stagger} initial="hidden" animate="visible">
			{/* Header */}
			<motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-1.5 text-sm">
						Manage all content in your portfolio CMS
					</p>
				</div>
			</motion.div>

			{/* Read-only banner */}
			{!isAdmin && (
				<motion.div variants={fadeUp} className="rounded-[20px] border border-blue-200 dark:border-blue-500/20 bg-blue-50/80 dark:bg-blue-500/5 px-5 py-3 flex items-center gap-3">
					<div className="size-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
						<Eye className="size-4 text-blue-600 dark:text-blue-400" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-blue-800 dark:text-blue-300">Read-only mode</p>
						<p className="text-xs text-blue-600/70 dark:text-blue-400/70">You can view content but changes require admin access.</p>
					</div>
				</motion.div>
			)}

			{loading && (
				<div className="flex items-center justify-center py-24">
					<Loader2 className="size-6 animate-spin text-muted-foreground/50" />
				</div>
			)}

			{!loading && stats && (
				<>
					{/* Premium Stats Grid */}
					<motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
						{/* Total Content stat */}
						<motion.div
							whileHover={{ y: -2, transition: { duration: 0.2 } }}
							className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-4 flex flex-col"
						>
							<div className="flex items-center justify-between mb-3">
								<div className="size-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
									<Briefcase className="size-4 text-primary" />
								</div>
								<span className="text-[11px] text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
									{total > 0 ? "+" + Math.min(Math.round((total / 3) * 100), 100) : 0}%
								</span>
							</div>
							<p className="text-2xl font-bold tracking-tight tabular-nums">{total}</p>
							<p className="text-[11px] text-muted-foreground mt-0.5">Total Content</p>
						</motion.div>

						{collectionMeta.map((m) => {
							const count = stats[m.key as keyof CollectionStats] ?? 0;
							const Icon = m.icon;
							return (
								<motion.div
									key={m.key}
									whileHover={{ y: -2, transition: { duration: 0.2 } }}
									className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-4 flex flex-col cursor-pointer"
									onClick={() => window.location.href = m.to}
								>
									<div className="flex items-center justify-between mb-3">
										<div className={`size-9 rounded-xl ${m.color.iconBg} flex items-center justify-center`}>
											<Icon className={`size-4 ${m.color.iconColor}`} />
										</div>
										<span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5 ${count > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-muted-foreground/40'}`}>
											{count > 0 ? "+" + Math.min(Math.round((count / 2) * 100), 100) : 0}%
										</span>
									</div>
									<p className="text-2xl font-bold tracking-tight tabular-nums">{count}</p>
									<p className="text-[11px] text-muted-foreground mt-0.5">{m.label}</p>
								</motion.div>
							);
						})}
					</motion.div>

					{/* Content Cards Grid */}
					<motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{collectionMeta.map((m, idx) => {
							const count = stats[m.key as keyof CollectionStats] ?? 0;
							return (
								<motion.div key={m.key} variants={fadeUp}>
									<StatCard
										title={m.label}
										count={count}
										description={m.desc}
										icon={m.icon}
										color={m.color}
										to={m.to}
										sparklineData={generateSparkline()}
										index={idx}
									/>
								</motion.div>
							);
						})}
					</motion.div>

					{/* Analytics Section - 2 column */}
					<motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
						<AnalyticsChart data={chartData} total={total} />
						<GrowthChart total={total} />
					</motion.div>

					{/* Analytics Section - 2 column (bottom) */}
					<motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
						<MonthlyActivity stats={stats as unknown as Record<string, number>} />
						<QuickActions />
					</motion.div>

					{/* Recent Activity Section */}
					{recentItems.length > 0 && (
						<motion.div variants={fadeUp} className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-5 sm:p-6">
							<div className="flex items-center gap-2 mb-5">
								<Clock className="size-4 text-muted-foreground" />
								<h3 className="text-sm font-semibold">Recent Activity</h3>
							</div>
							<div className="space-y-1">
								{recentItems.map((item, i) => {
									const meta = collectionMeta.find((m) => m.key === item.collection);
									const Icon = meta?.icon ?? Briefcase;
									const colorClass = meta?.color ?? collectionMeta[0].color;
									const badgeClass = categoryBadge[item.collection] ?? "bg-muted text-muted-foreground";
									return (
										<motion.div
											key={`${item.collection}-${item.id}`}
											initial={{ opacity: 0, x: -8 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.6 + i * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
										>
											<Link
												to={item.collection === 'jobs' ? '/admin/jobs' : item.collection === 'education' ? '/admin/education' : item.collection === 'projects' ? '/admin/projects' : item.collection === 'certificates' ? '/admin/certificates' : '/admin/technologies'}
												className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-all duration-200 group"
											>
												<div className={`size-9 rounded-xl ${colorClass.iconBg} flex items-center justify-center shrink-0`}>
													<Icon className={`size-4 ${colorClass.iconColor}`} />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
														{item.title}
													</p>
													<div className="flex items-center gap-2 mt-0.5">
														<span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${badgeClass}`}>
															{collectionLabels[item.collection] ?? item.collection}
														</span>
													</div>
												</div>
												<span className="text-[11px] text-muted-foreground/60 tabular-nums shrink-0">
													{timeAgo(item.updatedAt)}
												</span>
											</Link>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					)}

					{/* Empty state */}
					{total === 0 && (
						<motion.div variants={fadeUp} className="rounded-[20px] border border-dashed border-[#e5e7eb] dark:border-border bg-white dark:bg-card px-6 py-16 text-center">
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.3, duration: 0.4 }}
								className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4"
							>
								<Briefcase className="size-7 text-muted-foreground/40" />
							</motion.div>
							<p className="font-semibold text-foreground text-lg">No content yet</p>
							<p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
								Start building your portfolio by adding content to your collections using the quick actions below.
							</p>
						</motion.div>
					)}
				</>
			)}
		</motion.div>
	);
}

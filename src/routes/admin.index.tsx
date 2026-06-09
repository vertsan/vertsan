import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	AlertTriangle,
	Award,
	Briefcase,
	Cpu,
	FolderKanban,
	GraduationCap,
	Loader2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

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

const collectionMeta = [
	{
		key: "jobs",
		label: "Jobs",
		to: "/admin/jobs",
		icon: Briefcase,
		color: "from-blue-500/20 to-blue-600/10",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-600 dark:text-blue-400",
		desc: "Professional experience entries",
	},
	{
		key: "education",
		label: "Education",
		to: "/admin/education",
		icon: GraduationCap,
		color: "from-emerald-500/20 to-emerald-600/10",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-600 dark:text-emerald-400",
		desc: "Academic background",
	},
	{
		key: "projects",
		label: "Projects",
		to: "/admin/projects",
		icon: FolderKanban,
		color: "from-violet-500/20 to-violet-600/10",
		iconBg: "bg-violet-500/10",
		iconColor: "text-violet-600 dark:text-violet-400",
		desc: "Portfolio projects",
	},
	{
		key: "certificates",
		label: "Certificates",
		to: "/admin/certificates",
		icon: Award,
		color: "from-amber-500/20 to-amber-600/10",
		iconBg: "bg-amber-500/10",
		iconColor: "text-amber-600 dark:text-amber-400",
		desc: "Certifications & achievements",
	},
	{
		key: "technologies",
		label: "Technologies",
		to: "/admin/technologies",
		icon: Cpu,
		color: "from-rose-500/20 to-rose-600/10",
		iconBg: "bg-rose-500/10",
		iconColor: "text-rose-600 dark:text-rose-400",
		desc: "Tech stack categories",
	},
];

function AdminDashboard() {
	const [stats, setStats] = useState<CollectionStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all(
			collectionMeta.map((m) =>
				fetch("/api/admin", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ collection: m.key, action: "list" }),
				}).then((r) => r.json()),
			),
		)
			.then((results) => {
				const counts: CollectionStats = {
					jobs: (results[0].items || []).length,
					education: (results[1].items || []).length,
					projects: (results[2].items || []).length,
					certificates: (results[3].items || []).length,
					technologies: (results[4].items || []).length,
				};
				setStats(counts);
			})
			.catch(() => setStats({ jobs: 0, education: 0, projects: 0, certificates: 0, technologies: 0 }))
			.finally(() => setLoading(false));
	}, []);

	const total = stats
		? Object.values(stats).reduce((a, b) => a + b, 0)
		: 0;

	return (
		<div className="max-w-5xl space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground mt-1.5">
					Manage all content in your portfolio CMS
				</p>
			</div>

			{/* Summary bar */}
			{!loading && stats && (
				<div className="rounded-xl border bg-card px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
							<Briefcase className="size-5 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total content</p>
							<p className="text-2xl font-bold">{total}</p>
						</div>
					</div>
					<div className="flex gap-6 text-sm text-muted-foreground">
						{stats &&
							collectionMeta.map((m) => {
								const count = stats[m.key as keyof CollectionStats];
								return (
									<div key={m.key} className="text-center hidden sm:block">
										<p className="font-semibold text-foreground text-base">
											{count}
										</p>
										<p className="text-xs">{m.label}</p>
									</div>
								);
							})}
					</div>
				</div>
			)}

			{loading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="size-5 animate-spin text-muted-foreground" />
				</div>
			)}

			{/* Collection grid */}
			<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{collectionMeta.map((m) => {
					const count = stats?.[m.key as keyof CollectionStats];
					return (
						<Link
							key={m.key}
							to={m.to}
							className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
						>
							<div className={`h-1.5 bg-gradient-to-r ${m.color}`} />
							<div className="p-5 space-y-4">
								<div className="flex items-center justify-between">
									<div
										className={`size-11 rounded-xl ${m.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}
									>
										<m.icon
											className={`size-5 ${m.iconColor}`}
										/>
									</div>
									{count !== undefined && (
										<span className="text-2xl font-bold tabular-nums">
											{count}
										</span>
									)}
									{loading && (
										<Loader2 className="size-4 animate-spin text-muted-foreground" />
									)}
								</div>
								<div>
									<h3 className="font-semibold group-hover:text-primary transition-colors">
										{m.label}
									</h3>
									<p className="text-sm text-muted-foreground mt-0.5">
										{m.desc}
									</p>
								</div>
								<div className="text-xs text-muted-foreground/60 flex items-center gap-1 group-hover:text-primary/60 transition-colors">
									Manage {m.label.toLowerCase()}
									<span aria-hidden="true">&rarr;</span>
								</div>
							</div>
						</Link>
					);
				})}
			</div>

			{/* Status info */}
			{!loading && stats && total === 0 && (
				<div className="rounded-xl border border-dashed bg-muted/20 px-6 py-8 text-center">
					<AlertTriangle className="size-8 mx-auto text-muted-foreground/40 mb-3" />
					<p className="font-medium text-muted-foreground">
						No content yet
					</p>
					<p className="text-sm text-muted-foreground/60 mt-1">
						Start by adding some content to your collections
					</p>
				</div>
			)}
		</div>
	);
}

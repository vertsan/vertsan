import { Link } from "@tanstack/react-router";
import {
	Award,
	Briefcase,
	Cpu,
	FolderKanban,
	GraduationCap,
	Plus,
} from "lucide-react";

const actions = [
	{
		label: "Add Job",
		to: "/admin/jobs",
		icon: Briefcase,
		iconBg: "bg-blue-50 dark:bg-blue-500/10",
		iconColor: "text-blue-500",
		hoverBg: "hover:bg-blue-50/80 dark:hover:bg-blue-500/5",
	},
	{
		label: "Add Education",
		to: "/admin/education",
		icon: GraduationCap,
		iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
		iconColor: "text-emerald-500",
		hoverBg: "hover:bg-emerald-50/80 dark:hover:bg-emerald-500/5",
	},
	{
		label: "Add Project",
		to: "/admin/projects",
		icon: FolderKanban,
		iconBg: "bg-violet-50 dark:bg-violet-500/10",
		iconColor: "text-violet-500",
		hoverBg: "hover:bg-violet-50/80 dark:hover:bg-violet-500/5",
	},
	{
		label: "Add Certificate",
		to: "/admin/certificates",
		icon: Award,
		iconBg: "bg-amber-50 dark:bg-amber-500/10",
		iconColor: "text-amber-500",
		hoverBg: "hover:bg-amber-50/80 dark:hover:bg-amber-500/5",
	},
	{
		label: "Add Technology",
		to: "/admin/technologies",
		icon: Cpu,
		iconBg: "bg-rose-50 dark:bg-rose-500/10",
		iconColor: "text-rose-500",
		hoverBg: "hover:bg-rose-50/80 dark:hover:bg-rose-500/5",
	},
];

export default function QuickActions() {
	return (
		<div
			className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-6 animate-card-enter"
			style={{ animationDelay: "480ms" }}
		>
			<h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
			<div className="space-y-1.5">
				{actions.map((action) => (
					<Link
						key={action.label}
						to={action.to}
						className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${action.hoverBg}`}
					>
						<div
							className={`size-9 rounded-xl ${action.iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
						>
							<action.icon
								className={`size-4 ${action.iconColor}`}
							/>
						</div>
						<span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
							{action.label}
						</span>
						<Plus className="size-3.5 ml-auto text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
					</Link>
				))}
			</div>
		</div>
	);
}

import { Link, useLocation } from "@tanstack/react-router";
import {
	ArrowLeft,
	Award,
	Briefcase,
	Cpu,
	FolderKanban,
	GraduationCap,
	LayoutDashboard,
} from "lucide-react";

const links = [
	{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
	{ to: "/admin/jobs", label: "Jobs", icon: Briefcase },
	{ to: "/admin/education", label: "Education", icon: GraduationCap },
	{ to: "/admin/projects", label: "Projects", icon: FolderKanban },
	{ to: "/admin/certificates", label: "Certificates", icon: Award },
	{ to: "/admin/technologies", label: "Technologies", icon: Cpu },
];

export default function AdminSidebar() {
	const loc = useLocation();

	function isActive(to: string, exact?: boolean) {
		if (exact) return loc.pathname === to;
		return loc.pathname.startsWith(to);
	}

	return (
		<aside className="w-56 shrink-0 border-r border-border bg-card min-h-screen p-4 flex flex-col gap-1">
			{/* Branding */}
			<div className="px-3 py-3 mb-2 border-b border-border">
				<div className="flex items-center gap-2.5">
					<div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
						<LayoutDashboard className="size-4 text-primary" />
					</div>
					<div>
						<p className="text-sm font-bold tracking-tight">VertSan</p>
						<p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">
							Content Manager
						</p>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1">
				{links.map((link) => {
					const active = isActive(link.to, link.exact);
					return (
						<Link
							key={link.to}
							to={link.to}
							className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
								active
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							}`}
						>
							{active && (
								<span className="absolute left-0 w-0.5 h-5 bg-primary rounded-full" />
							)}
							<link.icon className="size-4 shrink-0" />
							{link.label}
						</Link>
					);
				})}
			</nav>

			{/* Back to site */}
			<div className="pt-4 border-t border-border">
				<Link
					to="/"
					className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
				>
					<ArrowLeft className="size-4 shrink-0" />
					Back to Site
				</Link>
			</div>
		</aside>
	);
}

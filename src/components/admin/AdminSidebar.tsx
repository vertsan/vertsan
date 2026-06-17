import { Link, useLocation } from "@tanstack/react-router";
import {
	ArrowLeft,
	Award,
	Briefcase,
	Cpu,
	FolderKanban,
	GraduationCap,
	LayoutDashboard,
	Settings,
	LogOut,
	Eye,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { useAuth } from "#/lib/admin/auth-context";
import { useState } from "react";

type NavSection = {
	label: string;
	items: NavItem[];
};

type NavItem = {
	to?: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	exact?: boolean;
	disabled?: boolean;
	color?: string;
};

const navSections: NavSection[] = [
	{
		label: "Main",
		items: [
			{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, color: "blue" },
		],
	},
	{
		label: "Content",
		items: [
			{ to: "/admin/jobs", label: "Jobs", icon: Briefcase, color: "blue" },
			{ to: "/admin/education", label: "Education", icon: GraduationCap, color: "emerald" },
			{ to: "/admin/projects", label: "Projects", icon: FolderKanban, color: "violet" },
			{ to: "/admin/certificates", label: "Certificates", icon: Award, color: "amber" },
			{ to: "/admin/technologies", label: "Technologies", icon: Cpu, color: "rose" },
		],
	},
	{
		label: "System",
		items: [
			{ label: "Settings", icon: Settings, disabled: true, color: "slate" },
		],
	},
];

const colorStyles: Record<string, { activeBg: string; activeDot: string; hoverBg: string; iconColor: string }> = {
	blue: {
		activeBg: "bg-blue-50 dark:bg-blue-500/10",
		activeDot: "bg-blue-500",
		hoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-500/5",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	emerald: {
		activeBg: "bg-emerald-50 dark:bg-emerald-500/10",
		activeDot: "bg-emerald-500",
		hoverBg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5",
		iconColor: "text-emerald-600 dark:text-emerald-400",
	},
	violet: {
		activeBg: "bg-violet-50 dark:bg-violet-500/10",
		activeDot: "bg-violet-500",
		hoverBg: "hover:bg-violet-50/50 dark:hover:bg-violet-500/5",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	amber: {
		activeBg: "bg-amber-50 dark:bg-amber-500/10",
		activeDot: "bg-amber-500",
		hoverBg: "hover:bg-amber-50/50 dark:hover:bg-amber-500/5",
		iconColor: "text-amber-600 dark:text-amber-400",
	},
	rose: {
		activeBg: "bg-rose-50 dark:bg-rose-500/10",
		activeDot: "bg-rose-500",
		hoverBg: "hover:bg-rose-50/50 dark:hover:bg-rose-500/5",
		iconColor: "text-rose-600 dark:text-rose-400",
	},
	slate: {
		activeBg: "bg-muted",
		activeDot: "bg-muted-foreground",
		hoverBg: "hover:bg-muted/50",
		iconColor: "text-muted-foreground",
	},
};

interface AdminSidebarProps {
	open: boolean;
	onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
	const loc = useLocation();
	const { user, logout: authLogout, isAdmin } = useAuth();
	const [loggingOut, setLoggingOut] = useState(false);

	function isActive(to: string, exact?: boolean) {
		if (exact) return loc.pathname === to;
		return loc.pathname.startsWith(to);
	}

	async function handleLogout() {
		setLoggingOut(true);
		await authLogout();
	}

	return (
		<>
			{/* Mobile overlay */}
			{open && (
				<button
					type="button"
					aria-label="Close sidebar overlay"
					className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden cursor-default"
					onClick={onClose}
				/>
			)}

			<aside
				className={cn(
					"w-60 max-w-[80vw] shrink-0 border-r border-border bg-card flex flex-col transition-all duration-300",
					"fixed lg:static inset-y-0 left-0 z-40 lg:z-auto",
					open
						? "translate-x-0"
						: "-translate-x-full lg:translate-x-0",
				)}
			>
				{/* Branding */}
				<div className="px-4 py-4 border-b border-border min-h-14 flex items-center">
					<div className="flex items-center gap-3">
						<div className="size-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
							<LayoutDashboard className="size-4 text-primary" />
							<span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
						</div>
						<div>
							<p className="text-sm font-bold tracking-tight">VertSan</p>
							<p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
								Content Manager
							</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
					{navSections.map((section) => (
						<div key={section.label}>
							<p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-3 mb-1.5">
								{section.label}
							</p>
							<div className="space-y-0.5">
								{section.items.map((link) => {
									const active = link.to ? isActive(link.to, link.exact) : false;
									const cs = colorStyles[link.color ?? "slate"];

									if (link.disabled) {
										return (
											<div
												key={link.label}
												className="relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none"
											>
												<link.icon className="size-4 shrink-0" />
												{link.label}
												<span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground/30 bg-muted/50 px-1.5 py-0.5 rounded-md">
													Soon
												</span>
											</div>
										);
									}

									return (
										<Link
											key={link.to}
											to={link.to!}
											onClick={onClose}
											className={cn(
												"relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
												active
													? cs.activeBg + " text-foreground"
													: cs.hoverBg + " text-muted-foreground hover:text-foreground",
											)}
										>
											{active && (
												<span className={cn("absolute left-0 w-0.5 h-5 rounded-full", cs.activeDot)} />
											)}
											<link.icon className={cn("size-4 shrink-0", active ? cs.iconColor : "")} />
											{link.label}
										</Link>
									);
								})}
							</div>
						</div>
					))}
				</nav>

				{/* Bottom section */}
				<div className="border-t border-border">
					{/* Back to site */}
					<div className="px-3 pt-3">
						<Link
							to="/"
							className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
						>
							<ArrowLeft className="size-4 shrink-0" />
							Back to Site
						</Link>
					</div>

					{/* User profile */}
					<div className="px-3 py-3 flex items-center gap-3">
						<div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold shrink-0">
							{(user?.name ?? "A").charAt(0).toUpperCase()}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{user?.name ?? "Admin"}</p>
							<div className="flex items-center gap-1.5 mt-0.5">
								<span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${isAdmin ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"}`}>
									{isAdmin ? "Admin" : "Reader"}
								</span>
								{!isAdmin && <Eye className="size-2.5 text-blue-500" />}
							</div>
						</div>
						<button
							type="button"
							onClick={handleLogout}
							disabled={loggingOut}
							className="size-7 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 flex items-center justify-center shrink-0"
							aria-label="Log out"
						>
							<LogOut className="size-3.5" />
						</button>
					</div>
				</div>
			</aside>
		</>
	);
}

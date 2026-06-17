import { Link, useLocation } from "@tanstack/react-router";
import { CalendarDays, Menu, PanelRightClose, PanelRightOpen, Search, Bell, ChevronDown } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import ThemeToggle from "#/components/ThemeToggle";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
	admin: "Dashboard",
	jobs: "Jobs",
	education: "Education",
	projects: "Projects",
	certificates: "Certificates",
	technologies: "Technologies",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	weekday: "long",
	month: "short",
	day: "numeric",
	year: "numeric",
});

function formatDate(date: Date): string {
	return dateFormatter.format(date);
}

interface AdminHeaderProps {
	onToggleSidebar: () => void;
	sidebarOpen: boolean;
}

export default function AdminHeader({
	onToggleSidebar,
	sidebarOpen,
}: AdminHeaderProps) {
	const loc = useLocation();
	const segments = loc.pathname.split("/").filter(Boolean);
	const [searchFocused, setSearchFocused] = useState(false);

	const crumbs: { label: string; to?: string }[] = [];
	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		const label = breadcrumbMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
		const to = `/${segments.slice(0, i + 1).join("/")}`;
		const isLast = i === segments.length - 1;
		crumbs.push(isLast ? { label } : { label, to });
	}

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border bg-[#fafafa]/80 dark:bg-background/80 backdrop-blur-xl">
			<div className="flex h-16 items-center gap-3 px-4 lg:px-6">
				<Button
					variant="ghost"
					size="icon"
					onClick={onToggleSidebar}
					aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
					className="shrink-0 lg:hidden"
				>
					<Menu className="size-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={onToggleSidebar}
					aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
					className="shrink-0 hidden lg:inline-flex text-muted-foreground hover:text-foreground transition-colors duration-200"
				>
					{sidebarOpen ? (
						<PanelRightClose className="size-4" />
					) : (
						<PanelRightOpen className="size-4" />
					)}
				</Button>

				<div className="flex items-center gap-2 min-w-0">
					<Link
						to="/admin"
						className="text-sm font-bold tracking-tight shrink-0 hidden sm:inline"
					>
						Vert<span className="text-primary">.</span>
					</Link>
					{crumbs.length > 1 && (
						<span className="text-muted-foreground/30 hidden sm:block select-none">/</span>
					)}
					<Breadcrumb className="truncate">
						<BreadcrumbList>
							{crumbs.flatMap((crumb, i) => {
								const item = (
									<BreadcrumbItem key={crumb.label}>
										{crumb.to ? (
											<BreadcrumbLink asChild>
												<Link
													to={crumb.to}
													className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
												>
													{crumb.label}
												</Link>
											</BreadcrumbLink>
										) : (
											<BreadcrumbPage className="text-sm font-medium">
												{crumb.label}
											</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								);
								if (i < crumbs.length - 1) {
									return [item, <BreadcrumbSeparator key={`sep-${crumb.label}`} />];
								}
								return [item];
							})}
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="ml-auto flex items-center gap-2">
					{/* Search */}
					<div className={`hidden md:flex items-center gap-2 rounded-xl border transition-all duration-200 ${searchFocused ? "border-primary/30 ring-2 ring-primary/10 bg-white" : "border-transparent bg-muted/60 hover:bg-muted"} px-3 py-1.5`}>
						<Search className="size-3.5 text-muted-foreground/50 shrink-0" />
						<input
							type="text"
							placeholder="Search content..."
							onFocus={() => setSearchFocused(true)}
							onBlur={() => setSearchFocused(false)}
							className="w-36 lg:w-44 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
						/>
						<span className="text-[10px] text-muted-foreground/30 font-mono hidden lg:inline">⌘K</span>
					</div>

					{/* Date */}
					<div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground/70 bg-muted/60 px-3 py-1.5 rounded-xl">
						<CalendarDays className="size-3.5" />
						<span className="tabular-nums">{formatDate(new Date())}</span>
					</div>

					{/* Notifications */}
					<Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
						<Bell className="size-4" />
						<span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
					</Button>

					<ThemeToggle />

					{/* User avatar */}
					<Button variant="ghost" className="hidden sm:flex items-center gap-2 px-2 rounded-xl text-muted-foreground hover:text-foreground">
						<div className="size-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
							A
						</div>
						<ChevronDown className="size-3 text-muted-foreground/50" />
					</Button>
				</div>
			</div>
		</header>
	);
}

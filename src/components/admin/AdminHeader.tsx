import { Link, useLocation } from "@tanstack/react-router";
import { Menu, PanelRightClose, PanelRightOpen } from "lucide-react";
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

const breadcrumbMap: Record<string, string> = {
	admin: "Dashboard",
	jobs: "Jobs",
	education: "Education",
	projects: "Projects",
	certificates: "Certificates",
	technologies: "Technologies",
};

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

	const crumbs: { label: string; to?: string }[] = [];
	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		const label = breadcrumbMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
		const to = `/${segments.slice(0, i + 1).join("/")}`;
		const isLast = i === segments.length - 1;
		crumbs.push(isLast ? { label } : { label, to });
	}

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
			<div className="flex h-14 items-center gap-4 px-4 lg:px-6">
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
					className="shrink-0 hidden lg:inline-flex text-muted-foreground hover:text-foreground"
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
						<span className="text-muted-foreground/40 hidden sm:block">/</span>
					)}
					<Breadcrumb className="truncate">
						<BreadcrumbList>
							{crumbs.map((crumb, i) => (
								<BreadcrumbItem key={crumb.label}>
									{crumb.to ? (
										<BreadcrumbLink asChild>
											<Link
												to={crumb.to}
												className="text-sm text-muted-foreground hover:text-foreground transition-colors"
											>
												{crumb.label}
											</Link>
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage className="text-sm font-medium">
											{crumb.label}
										</BreadcrumbPage>
									)}
									{i < crumbs.length - 1 && <BreadcrumbSeparator />}
								</BreadcrumbItem>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="ml-auto flex items-center gap-1">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}

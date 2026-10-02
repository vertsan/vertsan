import { Link, useLocation } from "@tanstack/react-router";
import { Award, FolderKanban, Home, LogIn, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import {
	MobileNav,
	MobileNavHeader,
	MobileNavMenu,
	MobileNavToggle,
	NavBody,
	Navbar,
	NavItems,
} from "#/components/ui/resizable-navbar";
import PresenceBadge from "./PresenceBadge";
import ThemeToggle from "./ThemeToggle";

const navItems = [
	{ name: "Home", link: "/", icon: Home },
	{ name: "About", link: "/about", icon: UserRound },
	{ name: "Projects", link: "/projects", icon: FolderKanban },
	{ name: "Certificates", link: "/certificates", icon: Award },
];

function resolveActiveLink(pathname: string): string | undefined {
	return navItems.find((item) => {
		if (item.link === "/") return pathname === "/";
		return pathname === item.link || pathname.startsWith(`${item.link}/`);
	})?.link;
}

export default function Header() {
	const { pathname } = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

	const activeLink = resolveActiveLink(pathname);
	const logoClass =
		"relative z-20 shrink-0 cursor-pointer px-2 py-1 font-semibold tracking-tight text-foreground";

	return (
		<Navbar className="top-0 z-50 pt-[env(safe-area-inset-top)]">
			<NavBody>
				<Link
					to="/"
					aria-label="Vert home"
					className={`${logoClass} text-lg md:text-xl`}
				>
					Vert<span className="text-primary">.</span>
				</Link>

				<NavItems
					items={navItems}
					linkComponent={Link}
					activeLink={activeLink}
				/>

				<div className="relative z-20 flex shrink-0 items-center gap-1 md:gap-1.5">
					<PresenceBadge />
					<ThemeToggle />
					<Link
						to="/login"
						className="header-chip hidden items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer lg:inline-flex"
					>
						<LogIn className="size-3.5" />
						Login
					</Link>
				</div>
			</NavBody>

			<MobileNav>
				<MobileNavHeader>
					<Link
						to="/"
						aria-label="Vert home"
						className={`${logoClass} text-lg`}
					>
						Vert<span className="text-primary">.</span>
					</Link>
					<MobileNavToggle
						isOpen={mobileOpen}
						onClick={() => setMobileOpen((prev) => !prev)}
					/>
				</MobileNavHeader>

				<MobileNavMenu
					isOpen={mobileOpen}
					onClose={() => setMobileOpen(false)}
					className="gap-1"
				>
					{navItems.map(({ name, link, icon: Icon }) => {
						const isActive = activeLink === link;
						return (
							<Link
								key={link}
								to={link}
								onClick={() => setMobileOpen(false)}
								aria-current={isActive ? "page" : undefined}
								className={`header-chip header-chip-nav flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium cursor-pointer ${
									isActive ? "bg-accent/70 text-foreground" : ""
								}`}
							>
								<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
									<Icon className="size-4" />
								</span>
								{name}
							</Link>
						);
					})}

					<div className="mt-1 w-full border-t border-border/40 pt-1">
						<Link
							to="/login"
							onClick={() => setMobileOpen(false)}
							className="header-chip header-chip-nav flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium cursor-pointer"
						>
							<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
								<LogIn className="size-4" />
							</span>
							Login
						</Link>
					</div>
				</MobileNavMenu>
			</MobileNav>
		</Navbar>
	);
}

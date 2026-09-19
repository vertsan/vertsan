import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	Award,
	FolderKanban,
	Home,
	LogIn,
	Menu,
	UserRound,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import GooeyNav from "./GooeyNav";
import PresenceBadge from "./PresenceBadge";
import ThemeToggle from "./ThemeToggle";

const navItems = [
	{ label: "Home", to: "/", icon: Home },
	{ label: "About", to: "/about", icon: UserRound },
	{ label: "Projects", to: "/projects", icon: FolderKanban },
	{ label: "Certificates", to: "/certificates", icon: Award },
];

/* Hysteresis thresholds to prevent flickering near the boundary */
const SCROLL_DOWN_THRESHOLD = 32;
const SCROLL_UP_THRESHOLD = 8;

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const scrolledRef = useRef(false);

	const updateScrolled = useCallback((value: boolean) => {
		if (scrolledRef.current !== value) {
			scrolledRef.current = value;
			setScrolled(value);
		}
	}, []);

	useEffect(() => {
		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const y = window.scrollY;
				if (scrolledRef.current) {
					if (y < SCROLL_UP_THRESHOLD) updateScrolled(false);
				} else {
					if (y > SCROLL_DOWN_THRESHOLD) updateScrolled(true);
				}
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(raf);
		};
	}, [updateScrolled]);

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

	const isCompact = scrolled || mobileOpen;

	return (
		<header
			data-scrolled={isCompact}
			className={`sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
				isCompact
					? "border-b border-border/40 bg-background/85 shadow-lg shadow-black/4 backdrop-blur-xl"
					: "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
			}`}
		>
			<div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 min-h-16 md:min-h-18 md:pt-0 pt-[env(safe-area-inset-top)]">
				<Link
					to="/"
					aria-label="Vert home"
					className="header-chip cursor-pointer font-semibold tracking-tight text-foreground shrink-0 text-lg md:text-xl px-2 py-1"
				>
					Vert<span className="text-primary">.</span>
				</Link>

				<div className="hidden md:flex flex-1 justify-center">
					<GooeyNav
						items={navItems}
						particleCount={15}
						particleDistances={[90, 10]}
						particleR={100}
						initialActiveIndex={0}
						animationTime={600}
						timeVariance={300}
						colors={[1, 2, 3, 1, 2, 3, 1, 4]}
					/>
				</div>

				<div className="flex items-center gap-1 md:gap-1.5 shrink-0">
					<PresenceBadge />
					<ThemeToggle />
					<Link
						to="/login"
						className="header-chip hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer"
					>
						<LogIn className="size-3.5" />
						Login
					</Link>
					<button
						type="button"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
						aria-expanded={mobileOpen}
						className="header-chip md:hidden p-2.5"
					>
						{mobileOpen ? (
							<X className="size-4" />
						) : (
							<Menu className="size-4" />
						)}
					</button>
				</div>
			</div>

			<AnimatePresence initial={false}>
				{mobileOpen ? (
					<motion.nav
						key="mobile-nav"
						aria-label="Mobile navigation"
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
						className="md:hidden overflow-hidden border-t border-border/40 bg-background/95 shadow-lg shadow-black/5 backdrop-blur-xl"
					>
						<div className="px-3 sm:px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
							<div className="space-y-1">
								{navItems.map(({ label, to, icon: Icon }) => (
									<Link
										key={label}
										to={to}
										onClick={() => setMobileOpen(false)}
										className="header-chip header-chip-nav flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 min-h-11 text-sm font-medium cursor-pointer"
									>
										<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
											<Icon className="size-4" />
										</span>
										{label}
									</Link>
								))}
							</div>

							<div className="mt-2 border-t border-border/40 pt-2">
								<Link
									to="/login"
									onClick={() => setMobileOpen(false)}
									className="header-chip flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 min-h-11 text-sm font-medium cursor-pointer"
								>
									<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
										<LogIn className="size-4" />
									</span>
									Login
								</Link>
							</div>
						</div>
					</motion.nav>
				) : null}
			</AnimatePresence>
		</header>
	);
}

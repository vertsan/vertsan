import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import GooeyNav from "./GooeyNav";
import PresenceBadge from "./PresenceBadge";
import ThemeToggle from "./ThemeToggle";

const navItems = [
	{ label: "Home", to: "/" },
	{ label: "About", to: "/about" },
	{ label: "Projects", to: "/projects" },
	{ label: "Certificates", to: "/certificates" },
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
			className={`sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
				isCompact
					? "border-b border-border/40 bg-background/85 shadow-lg shadow-black/4 backdrop-blur-xl"
					: "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
			}`}
		>
			<div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 md:h-18">
				<Link
					to="/"
					className="cursor-pointer font-semibold tracking-tight text-foreground shrink-0 text-lg md:text-xl"
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

				<div className="flex items-center gap-2 shrink-0">
					<PresenceBadge />
					<ThemeToggle />
					<Link
						to="/login"
						className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						<LogIn className="size-3.5" />
						Login
					</Link>
					<button
						type="button"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
						className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						{mobileOpen ? (
							<X className="size-4" />
						) : (
							<Menu className="size-4" />
						)}
					</button>
				</div>
			</div>

			<motion.div
				animate={{
					height: mobileOpen ? "auto" : 0,
					opacity: mobileOpen ? 1 : 0,
				}}
				transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
				className={`md:hidden overflow-hidden ${
					mobileOpen ? "border-t border-border/40" : ""
				}`}
			>
				<nav className="flex flex-col px-4 py-3 gap-0.5 bg-background/95 backdrop-blur-xl">
					{navItems.map((link) => (
						<Link
							key={link.label}
							to={link.to}
							onClick={() => setMobileOpen(false)}
							className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors font-medium"
						>
							{link.label}
						</Link>
					))}
					<div className="border-t border-border/40 my-1 pt-2">
						<Link
							to="/login"
							onClick={() => setMobileOpen(false)}
							className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors font-medium cursor-pointer"
						>
							<LogIn className="size-3.5" />
							Login
						</Link>
					</div>
				</nav>
			</motion.div>
		</header>
	);
}

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import GooeyNav from "./GooeyNav";
import ThemeToggle from "./ThemeToggle";

const navItems = [
	{ label: "Home", to: "/" },
	{ label: "About", to: "/about" },
	{ label: "Projects", to: "/projects" },
	{ label: "Certificates", to: "/certificates" },
];

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const y = window.scrollY;
				setScrolled(y > 8);
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(raf);
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

	return (
		<motion.header
			data-scrolled={scrolled || mobileOpen}
			className={`sticky top-0 z-50 w-full will-change-transform ${
				scrolled || mobileOpen
					? "border-b border-border/40 bg-background/85 shadow-lg shadow-black/4 backdrop-blur-xl supports-backdrop-filter:bg-background/70"
					: "border-b border-transparent bg-transparent"
			}`}
		>
			<div
				className={`max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
					scrolled ? "h-13 md:h-14" : "h-16 md:h-18"
				}`}
			>
				<Link
					to="/"
					className={`cursor-pointer font-semibold tracking-tight text-foreground transition-[font-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
						scrolled ? "text-base md:text-lg" : "text-lg md:text-xl"
					}`}
				>
					Vert<span className="text-primary">.</span>
				</Link>

				<motion.div
					className="hidden md:flex flex-1 justify-center"
					initial={false}
				>
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
				</motion.div>

				<div className="flex items-center gap-1 shrink-0">
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
		</motion.header>
	);
}

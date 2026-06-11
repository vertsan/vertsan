import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
	{ to: "/" as const, label: "Home" },
	{ to: "/technologies" as const, label: "Technologies" },
	{ to: "/experience" as const, label: "Experience" },
	{ to: "/projects" as const, label: "Projects" },
	{ to: "/certificates" as const, label: "Certificates" },
];

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => { document.body.style.overflow = ""; };
	}, [mobileOpen]);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-xl border-b border-border/40"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
				<Link
					to="/"
					className="text-lg font-semibold tracking-tight text-foreground"
				>
					Vert<span className="text-primary">.</span>
				</Link>

				<nav className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							to={link.to}
							activeOptions={{ exact: link.to === "/" }}
							className="relative px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 [&.active]:text-foreground [&.active]:after:scale-x-100 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-foreground after:scale-x-0 after:origin-center after:transition-transform after:duration-200"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-1">
					<ThemeToggle />

					<button
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
						className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
					</button>
				</div>
			</div>

			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ${
					mobileOpen ? "max-h-80 border-t border-border/40" : "max-h-0"
				}`}
			>
				<nav className="flex flex-col px-4 py-3 gap-0.5 bg-background/95 backdrop-blur-xl">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							to={link.to}
							activeOptions={{ exact: link.to === "/" }}
							onClick={() => setMobileOpen(false)}
							className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors [&.active]:text-foreground [&.active]:bg-muted/80 font-medium"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
}

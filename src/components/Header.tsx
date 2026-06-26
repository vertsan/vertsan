import { Link } from "@tanstack/react-router";
import { LogIn, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface NavLink {
  label: string;
  to: string;
}

const navLinks: NavLink[] = [
  { label: "Projects", to: "/projects" },
  { label: "Certificates", to: "/certificates" },
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

  const scrollToHero = useCallback(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
	return (
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-xl border-b border-border/40"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
				<Link
				to="/"
				className="text-lg font-semibold tracking-tight text-foreground cursor-pointer"
				>
				Vert<span className="text-primary">.</span>
				</Link>

				<nav className="hidden md:flex items-center gap-1">
					<button
						onClick={scrollToHero}
						className="relative px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-foreground after:scale-x-0 after:origin-center after:transition-transform after:duration-200 hover:after:scale-x-100 cursor-pointer"
					>
						Home
					</button>
					{navLinks.map((link) => (
						<Link
							key={link.label}
							to={link.to}
							className="relative px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-foreground after:scale-x-0 after:origin-center after:transition-transform after:duration-200 hover:after:scale-x-100"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-1">
					
					<ThemeToggle />
					<Link
						to="/login"
						className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						<LogIn className="size-3.5" />
						Login
					</Link>
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
					<button
						onClick={scrollToHero}
						className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors font-medium text-left cursor-pointer"
					>
						Home
					</button>
					{navLinks.map((link) => (
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
			</div>
		</header>
	);
  }

import { useRouter } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface NavLink {
  label: string;
  sectionId: string;
}

const navLinks: NavLink[] = [
  { label: "Home", sectionId: "hero" },
  { label: "Technologies", sectionId: "technologies" },
  { label: "Experience", sectionId: "experience" },
  { label: "Projects", sectionId: "projects" },
  { label: "Certificates", sectionId: "certificates" },
];

export default function Header() {
  const router = useRouter();
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

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileOpen(false);

    const scrollTo = (id: string) => {
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return true;
      }
      const el = document.getElementById(id);
      if (!el) return false;
      const headerHeight = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
      return true;
    };

    // If the section already exists in the DOM, scroll immediately
    if (sectionId === "hero" || document.getElementById(sectionId)) {
      scrollTo(sectionId);
      return;
    }

    // Otherwise navigate home first, then scroll once the route has settled
    router.navigate({ to: "/" }).then(() => {
      // router.navigate resolves after the route change is committed,
      // but React hasn't flushed the new render yet — wait one frame.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollTo(sectionId);
        });
      });
    });
  }, [router]);
	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-xl border-b border-border/40"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
				<button
					onClick={() => scrollToSection("hero")}
					className="text-lg font-semibold tracking-tight text-foreground cursor-pointer"
				>
					Vert<span className="text-primary">.</span>
				</button>

				<nav className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<button
							key={link.label}
							onClick={() => scrollToSection(link.sectionId)}
							className="relative px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-foreground after:scale-x-0 after:origin-center after:transition-transform after:duration-200 hover:after:scale-x-100 cursor-pointer"
						>
							{link.label}
						</button>
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
						<button
							key={link.label}
							onClick={() => scrollToSection(link.sectionId)}
							className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors font-medium text-left cursor-pointer"
						>
							{link.label}
						</button>
					))}
				</nav>
			</div>
		</header>
	);
  }

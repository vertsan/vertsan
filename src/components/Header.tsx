import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import { showResumeAssistant } from "./ResumeAssistant";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
	{ to: "/", label: "Home", hash: undefined },
	{ to: "/", label: "Technologies", hash: "technologies" },
	{ to: "/", label: "Experience", hash: "experience" },
	{ to: "/", label: "Projects", hash: "projects" },
	{ to: "/", label: "Certificates", hash: "certificates" },
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
					? "bg-background/80 backdrop-blur-xl shadow-xs border-b border-border/40"
					: "bg-background/50 backdrop-blur-sm border-transparent"
			}`}
		>
			<div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
				<Link
					to="/"
					className="group text-xl font-bold tracking-tight relative"
				>
					Vert
					<span className="text-primary/80 group-hover:text-primary transition-colors duration-300">
						.
					</span>
				</Link>

				<nav className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<Button key={link.label} variant="ghost" size="sm" asChild>
							<Link
								to={link.to}
								hash={link.hash}
								activeProps={{
									className:
										"!text-primary !bg-primary/5 font-medium after:!w-[60%]",
								}}
								activeOptions={{ exact: !link.hash }}
								className="relative"
							>
								{link.label}
							</Link>
						</Button>
					))}
				</nav>

				<div className="flex items-center gap-1">
					{/* <Button
						variant="ghost"
						size="icon"
						onClick={() => showResumeAssistant.setState(() => true)}
						aria-label="Open Resume Assistant"
						className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
					>
						<MessageCircle className="size-4" />
					</Button> */}

					<ThemeToggle />

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
						className="md:hidden relative"
					>
						<div className="relative size-4">
							<span
								className={`absolute inset-0 transition-all duration-300 ${
									mobileOpen
										? "rotate-90 opacity-0 scale-75"
										: "rotate-0 opacity-100 scale-100"
								}`}
							>
								<Menu className="size-4" />
							</span>
							<span
								className={`absolute inset-0 transition-all duration-300 ${
									mobileOpen
										? "rotate-0 opacity-100 scale-100"
										: "-rotate-90 opacity-0 scale-75"
								}`}
							>
								<X className="size-4" />
							</span>
						</div>
					</Button>
				</div>
			</div>

			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					mobileOpen ? "max-h-96 border-t border-border/40" : "max-h-0"
				}`}
			>
				<nav className="flex flex-col px-6 py-4 gap-1 bg-background/95 backdrop-blur-xl">
					{navLinks.map((link, i) => (
						<div
							key={link.label}
							className={`transition-all duration-300 ${
								mobileOpen
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-2"
							}`}
							style={{ transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
						>
							<Button
								variant="ghost"
								size="sm"
								asChild
								className="justify-start w-full"
							>
								<Link
									to={link.to}
									hash={link.hash}
									onClick={() => setMobileOpen(false)}
									activeProps={{
										className:
											"!text-primary !bg-primary/5 font-medium",
									}}
									activeOptions={{ exact: !link.hash }}
								>
									{link.label}
								</Link>
							</Button>
						</div>
					))}
					<div
						className={`transition-all duration-300 ${
							mobileOpen
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-2"
						}`}
						style={{
							transitionDelay: mobileOpen
								? `${navLinks.length * 60}ms`
								: "0ms",
						}}
					>
						<Button
							variant="ghost"
							size="sm"
							className="justify-start gap-2 w-full"
							onClick={() => {
								showResumeAssistant.setState(() => true);
								setMobileOpen(false);
							}}
						>
							<MessageCircle className="size-4" />
							Resume Assistant
						</Button>
					</div>
				</nav>
			</div>
		</header>
	);
}

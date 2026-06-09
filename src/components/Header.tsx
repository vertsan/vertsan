import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
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

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
				{/* Logo */}
				<Link to="/" className="text-xl font-bold tracking-tight">
					Vert<span className="text-primary">.</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<Button key={link.label} variant="ghost" size="sm" asChild>
							<Link
								to={link.to}
								hash={link.hash}
								activeProps={{
									className: "!text-primary !bg-primary/5 font-medium",
								}}
								activeOptions={{ exact: !link.hash }}
								className="relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-primary after:rounded-full after:transition-all hover:after:w-[60%]"
							>
								{link.label}
							</Link>
						</Button>
					))}
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-1">
					{/* <Button
            variant="ghost"
            size="icon"
            onClick={() => showResumeAssistant.setState(() => true)}
            aria-label="Open Resume Assistant"
            className="hidden sm:inline-flex"
          >
            <MessageCircle className="size-4" />
          </Button> */}

					<ThemeToggle />

					{/* Mobile menu toggle */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
						className="md:hidden"
					>
						{mobileOpen ? (
							<X className="size-4" />
						) : (
							<Menu className="size-4" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Nav */}
			{mobileOpen && (
				<div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
					<nav className="flex flex-col px-6 py-4 gap-1">
						{navLinks.map((link) => (
							<Button
								key={link.label}
								variant="ghost"
								size="sm"
								asChild
								className="justify-start"
							>
								<Link
									to={link.to}
									hash={link.hash}
									onClick={() => setMobileOpen(false)}
									activeProps={{
										className: "!text-primary !bg-primary/5 font-medium",
									}}
									activeOptions={{ exact: !link.hash }}
								>
									{link.label}
								</Link>
							</Button>
						))}
						<Button
							variant="ghost"
							size="sm"
							className="justify-start gap-2"
							onClick={() => {
								showResumeAssistant.setState(() => true);
								setMobileOpen(false);
							}}
						>
							<MessageCircle className="size-4" />
							Resume Assistant
						</Button>
					</nav>
				</div>
			)}
		</header>
	);
}

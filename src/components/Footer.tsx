import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";

const year = new Date().getFullYear();

const footerLinks = [
	{ to: "/" as const, label: "Home" },
	{ to: "/about" as const, label: "About" },
	{ to: "/projects" as const, label: "Projects" },
	{ to: "/certificates" as const, label: "Certificates" },
];

const socialLinks = [
	{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
	{
		href: "https://linkedin.com/in/vertsan",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{ href: "mailto:itsanvert@gmail.com", label: "Email", icon: Mail },
];

export default function Footer() {
	return (
		<footer className="border-t border-border/40 bg-background">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
				{/* Main footer content */}
				<div className="flex flex-col gap-6 py-8 sm:py-10 md:flex-row md:items-center md:justify-between">
					{/* Left: Brand + nav */}
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:items-center">
						<Link
							to="/"
							className="text-base font-semibold tracking-tight text-foreground"
						>
							Vert<span className="text-primary">.</span>
						</Link>

						<nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
							{footerLinks.map((link) => (
								<Link
									key={link.label}
									to={link.to}
									className="text-xs text-muted-foreground hover:text-foreground transition-colors"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Right: Socials */}
					<div className="flex items-center justify-center gap-1.5 md:justify-end">
						{socialLinks.map(({ href, label, icon: Icon }) => (
							<a
								key={label}
								href={href}
								target={href.startsWith("mailto:") ? undefined : "_blank"}
								rel="noreferrer"
								className="flex size-9 sm:size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
								aria-label={label}
							>
								<Icon className="size-3.5" />
							</a>
						))}
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex items-center justify-center border-t border-border/30 py-4">
					<span className="text-xs text-muted-foreground/50">
						&copy; {year} Vert San. All rights reserved.
					</span>
				</div>
			</div>
		</footer>
	);
}

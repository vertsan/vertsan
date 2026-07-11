import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

const year = new Date().getFullYear();

export default function Footer() {
	return (
		<footer className="border-t border-border/40">
			<div className="px-6 py-12">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-6">
						<Link
							to="/"
							className="text-sm font-semibold tracking-tight text-foreground"
						>
							Vert<span className="text-primary">.</span>
						</Link>

						<nav className="hidden sm:flex items-center gap-4">
							{[
								{ to: "/" as const, label: "Home" },
								{ to: "/about" as const, label: "About" },
								{ to: "/projects" as const, label: "Projects" },
								{ to: "/certificates" as const, label: "Certificates" },
							].map((link) => (
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

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<a
								href="https://github.com/vertsan"
								target="_blank"
								rel="noreferrer"
								className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
								aria-label="GitHub"
							>
								<Github className="size-4" />
							</a>
							<a
								href="https://linkedin.com/in/vertsan"
								target="_blank"
								rel="noreferrer"
								className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="size-4" />
							</a>
							<a
								href="mailto:itsanvert@gmail.com"
								className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Email"
							>
								<Mail className="size-4" />
							</a>
						</div>

						<span className="text-xs text-muted-foreground/60">
							&copy; {year}
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}

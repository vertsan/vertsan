import { Link } from "@tanstack/react-router";
import { Github, Heart, Linkedin, Mail } from "lucide-react";
import { Button } from "#/components/ui/button";

const year = new Date().getFullYear();

const footerLinks = [
	{ to: "/", label: "Home", hash: undefined },
	{ to: "/", label: "Technologies", hash: "technologies" },
	{ to: "/", label: "Experience", hash: "experience" },
	{ to: "/", label: "Education", hash: "education" },
	{ to: "/", label: "Projects", hash: "projects" },
	{ to: "/", label: "Certificates", hash: "certificates" },
];

export default function Footer() {
	return (
		<footer className="border-t border-border/40 bg-muted/20">
			<div className="max-w-6xl mx-auto px-6 py-16">
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-4">
						<Link
							to="/"
							className="group text-xl font-bold tracking-tight"
						>
							Vert
							<span className="text-primary/80 group-hover:text-primary transition-colors duration-300">
								.
							</span>
						</Link>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
							Building modern web experiences with clean code and great
							design. Focused on accessibility, performance, and user
							experience.
						</p>
						<div className="flex items-center gap-2">
							<a
								href="https://github.com"
								target="_blank"
								rel="noreferrer"
								className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
								aria-label="GitHub"
							>
								<Github className="size-4" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noreferrer"
								className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
								aria-label="LinkedIn"
							>
								<Linkedin className="size-4" />
							</a>
							<a
								href="mailto:hello@example.com"
								className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
								aria-label="Email"
							>
								<Mail className="size-4" />
							</a>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground/80">
							Navigation
						</h3>
						<nav className="flex flex-col gap-2">
							{footerLinks.map((link) => (
								<Button
									key={link.label}
									variant="link"
									size="sm"
									asChild
									className="justify-start h-auto p-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
								>
									<Link to={link.to} hash={link.hash}>
										{link.label}
									</Link>
								</Button>
							))}
						</nav>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground/80">
							Built With
						</h3>
						<div className="flex flex-wrap gap-2">
							{[
								"React",
								"TanStack Start",
								"TypeScript",
								"Tailwind CSS",
								"shadcn/ui",
								"Vite",
							].map((tech) => (
								<span
									key={tech}
									className="px-2.5 py-1 text-xs rounded-md bg-accent/50 text-muted-foreground border border-border/50 transition-colors duration-200 hover:bg-accent/80"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; {year} Vert San. All rights reserved.
					</p>
					<p className="text-xs text-muted-foreground flex items-center gap-1">
						Built with{" "}
						<Heart className="size-3 text-red-500 fill-red-500 animate-pulse-dot" />{" "}
						using TanStack Start
					</p>
				</div>
			</div>
		</footer>
	);
}

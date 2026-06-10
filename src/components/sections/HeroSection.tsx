import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
			<div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/[0.03] dark:to-primary/[0.06]" />

			{/* Animated floating shapes */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
				<div className="absolute bottom-1/3 right-[10%] w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl animate-float-slow" />
				<div
					className="absolute top-[60%] left-[8%] w-48 h-48 border border-primary/10 rounded-full blur-2xl animate-float"
					style={{ animationDelay: "-3s" }}
				/>
				<div className="absolute top-[15%] right-[20%] w-32 h-32 bg-primary/[0.04] rounded-full blur-2xl animate-float-slow" />
			</div>

			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
				<div
					className="space-y-6 animate-fade-in-up"
				>
					<Badge
						variant="secondary"
						className="px-4 py-1.5 text-sm gap-2"
					>
						<span className="relative flex size-2">
							<span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
							<span className="relative rounded-full size-2 bg-emerald-500" />
						</span>
						Available for opportunities
					</Badge>

					<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
						<span className="text-foreground">Hi, I'm </span>
						<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
							Vert San
						</span>
					</h1>
				</div>

				<div
					className="space-y-6 animate-fade-in-up"
					style={{ animationDelay: "0.15s" }}
				>
					<p className="text-xl md:text-2xl text-muted-foreground font-medium">
						Software Engineer
					</p>

					<p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
						I build accessible, performant web applications with modern
						technologies. Passionate about clean code, great user experiences,
						and open source.
					</p>
				</div>

				<div
					className="flex flex-wrap items-center justify-center gap-4 pt-2 animate-fade-in-up"
					style={{ animationDelay: "0.3s" }}
				>
					<Button size="lg" className="gap-2 group shadow-sm" asChild>
						<Link to="/" hash="projects">
							View My Work
							<ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
						</Link>
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="gap-2 group"
						asChild
					>
						<a href="/resume.pdf" download>
							<Download className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
							Download CV
						</a>
					</Button>
				</div>

				<div
					className="flex items-center justify-center gap-3 pt-2 animate-fade-in"
					style={{ animationDelay: "0.45s" }}
				>
					{[
						{ href: "https://github.com", label: "GitHub", icon: Github },
						{
							href: "https://linkedin.com",
							label: "LinkedIn",
							icon: Linkedin,
						},
						{ href: "mailto:hello@example.com", label: "Email", icon: Mail },
					].map(({ href, label, icon: Icon }) => (
						<a
							key={label}
							href={href}
							target="_blank"
							rel="noreferrer"
							className="p-3 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all duration-300"
							aria-label={label}
						>
							<Icon className="size-5" />
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

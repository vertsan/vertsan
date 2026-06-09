import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />
			<div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
				{/* Greeting */}
				<div className="space-y-4">
					<Badge variant="secondary" className="px-4 py-1.5 text-sm">
						Available for opportunities
					</Badge>
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
						<span className="text-foreground">Hi, I'm </span>
						<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							Vert San 
						</span>
					</h1>
				</div>

				{/* Role */}
				<p className="text-xl md:text-2xl text-muted-foreground font-medium">
					Software Engineer
				</p>

				{/* Bio */}
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
					I build accessible, performant web applications with modern
					technologies. Passionate about clean code, great user experiences, and
					open source.
				</p>

				{/* CTAs */}
				<div className="flex flex-wrap items-center justify-center gap-4 pt-4">
					<Button size="lg" className="gap-2" asChild>
						<a href="#projects">
							View My Work
							<ArrowDown className="size-4" />
						</a>
					</Button>
					<Button variant="outline" size="lg" className="gap-2" asChild>
						<a href="/resume.pdf" download>
							<Download className="size-4" />
							Download CV
						</a>
					</Button>
				</div>

				{/* Social links */}
				<div className="flex items-center justify-center gap-4 pt-4">
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						className="p-3 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="GitHub"
					>
						<Github className="size-5" />
					</a>
					<a
						href="https://linkedin.com"
						target="_blank"
						rel="noreferrer"
						className="p-3 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="LinkedIn"
					>
						<Linkedin className="size-5" />
					</a>
					<a
						href="mailto:hello@example.com"
						className="p-3 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="Email"
					>
						<Mail className="size-5" />
					</a>
				</div>
			</div>
		</section>
	);
}

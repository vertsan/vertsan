import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
	AnimatedSpan,
	Terminal,
	TypingAnimation,
} from "#/components/ui/terminal";

export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center ">
			<div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
				<div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
					<div className="space-y-8">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<img src="/itachi-idle.gif" alt="itachi" className="size-10" />
							</div>
							<p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
								Full-Stack Developer
							</p>

							<h1 className="text-[2.5rem] sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.1]">
								Hi, I'm <span className="font-bold">Vert San</span>
							</h1>

							<p className="text-muted-foreground/70 max-w-md leading-relaxed">
								I design and build accessible, scalable, secure, and
								high-performance web and mobile applications using modern
								technologies and best practices.
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<Button size="lg" className="gap-2" asChild>
								<Link to="/" hash="projects">
									View My Work
									<ArrowDown className="size-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" className="gap-2" asChild>
								<a href="/resume.pdf" download>
									<Download className="size-4" />
									Download Resume
								</a>
							</Button>
						</div>

						<div className="flex items-center gap-5 pt-2">
							{[
								{
									href: "https://github.com/vertsan",
									label: "GitHub",
									icon: Github,
								},
								{
									href: "https://linkedin.com/in/vertsan",
									label: "LinkedIn",
									icon: Linkedin,
								},
								{
									href: "mailto:itsanvert@gmail.com",
									label: "Email",
									icon: Mail,
								},
							].map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noreferrer"
									className="text-muted-foreground hover:text-foreground transition-colors"
									aria-label={label}
								>
									<Icon className="size-5" />
								</a>
							))}
						</div>
					</div>

					<div className="flex items-center justify-center">
						<div className="w-full max-w-sm md:max-w-md">
							<Terminal>
								<TypingAnimation className="text-green-500">
									&gt; pnpm dlx shadcn@latest init
								</TypingAnimation>

								<AnimatedSpan className="text-green-500" delay="2400ms">
									✔ Preflight checks.
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="3000ms">
									✔ Verifying framework. Found Next.js.
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="3600ms">
									✔ Validating Tailwind CSS.
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="4200ms">
									✔ Validating import alias.
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="4800ms">
									✔ Writing components.json.
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="5400ms">
									✔ Checking registry.
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="6000ms">
									✔ Updating tailwind.config.ts
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="6600ms">
									✔ Updating app/globals.css
								</AnimatedSpan>

								<AnimatedSpan className="text-green-500" delay="7200ms">
									✔ Installing dependencies.
								</AnimatedSpan>

								<AnimatedSpan className="text-blue-500" delay="7800ms">
									<span>ℹ Updated 1 file:</span>
									<span className="pl-2">- lib/utils.ts</span>
								</AnimatedSpan>

								<TypingAnimation className="text-muted-foreground" delay="8400ms">
									Success! Project initialization completed.
								</TypingAnimation>

								<TypingAnimation className="text-muted-foreground" delay="10600ms">
									You may now add components.
								</TypingAnimation>
							</Terminal>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

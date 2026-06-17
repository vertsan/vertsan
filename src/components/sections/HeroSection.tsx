import { Suspense } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import Lanyard from "#/components/Lanyard/Lanyard";


export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center pt-16">
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
  I design and build accessible, scalable, secure, and high-performance web
  and mobile applications using modern technologies and best practices.
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
								{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
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
						<div className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-md aspect-[3/4]">
							<Suspense
								fallback={
									<div className="size-full animate-pulse rounded-2xl bg-muted" />
								}
							>
								<Lanyard frontImage="/image.png" />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

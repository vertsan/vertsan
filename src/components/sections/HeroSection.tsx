import { Link } from "@tanstack/react-router";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "#/lib/utils";
import { PersonalInfo } from "#/components/ui/terminal";
import { AnimatedGradientText } from "#/registry/magicui/animated-gradient-text";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";
import { RainbowButton } from "#/registry/magicui/rainbow-button";

export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
			<FlickeringGrid
				className="absolute top-0 left-0 right-0 z-0 h-48"
				squareSize={4}
				gridGap={6}
				color="#4ade80"
				maxOpacity={0.14}
				flickerChance={0.1}
				width={1400}
				height={200}
			/>
			<div className="max-w-6xl mx-auto w-full px-4 sm:px-6 relative z-10">
				<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
					<div className="space-y-8">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<img src="/itachi-idle.gif" alt="itachi" className="size-10" />
							</div>
							<div className="group relative flex w-fit items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
								<span
									className={cn(
										"animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
									)}
									style={{
										WebkitMask:
											"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
										WebkitMaskComposite: "destination-out",
										mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
										maskComposite: "subtract",
										WebkitClipPath: "padding-box",
									}}
								/>
								<AnimatedGradientText className="text-sm font-medium tracking-widest uppercase">
									Full Stack Developer
								</AnimatedGradientText>
							</div>

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
							<RainbowButton size="lg" className="gap-2" asChild>
								<Link to="/projects">
									View My Work
									<ArrowDown className="size-4" />
								</Link>
							</RainbowButton>
							<RainbowButton variant="outline" size="lg" className="gap-2" asChild>
								<a href="/resume.pdf" download>
									<Download className="size-4" />
									Download Resume
								</a>
							</RainbowButton>
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
									className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-200"
									aria-label={label}
								>
									<Icon className="size-5" />
								</a>
							))}
						</div>
					</div>

					<div className="flex justify-center self-start">
						<div className="w-full max-w-sm md:max-w-md">
							<PersonalInfo />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

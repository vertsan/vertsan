import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { useMemo } from "react";
import { AuroraText } from "#/components/ui/aurora-text";
import { ShineBorder } from "#/components/ui/shine-border";
import { PersonalInfo } from "#/components/ui/terminal";
import { useLiveContent } from "#/lib/useLiveContent";
import { cn } from "#/lib/utils";
import { AnimatedGradientText } from "#/registry/magicui/animated-gradient-text";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";
import { RainbowButton } from "#/registry/magicui/rainbow-button";
import MorphSlider, { type MorphItem } from "./MorphSlider";

interface HeroProject {
	title: string;
	startDate: string;
	image?: string | null;
}

const socials = [
	{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
	{
		href: "https://linkedin.com/in/vertsan",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{ href: "mailto:itsanvert@gmail.com", label: "Email", icon: Mail },
];

export default function HeroSection() {
	const { items: projects } = useLiveContent<HeroProject>("projects");

	const slides = useMemo<MorphItem[]>(
		() =>
			[...projects]
				.filter((project) => project.image)
				.sort(
					(a, b) =>
						new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
				)
				.map((project) => ({
					image: project.image as string,
					caption: project.title,
				})),
		[projects],
	);

	return (
		<section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
			<FlickeringGrid
				className="absolute inset-0 z-0 h-48 md:h-64"
				squareSize={4}
				gridGap={6}
				color="#4ade80"
				maxOpacity={0.14}
				flickerChance={0.1}
				width={1400}
				height={200}
			/>
			{/* soft ambient glow behind the terminal */}
			<div
				aria-hidden
				className="pointer-events-none absolute right-0 top-1/4 z-0 hidden h-96 w-96 -translate-y-1/4 rounded-full opacity-40 blur-3xl lg:block"
				style={{
					background:
						"radial-gradient(circle, color-mix(in oklch, var(--accent-1) 30%, transparent), transparent 70%)",
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -left-24 bottom-0 z-0 hidden h-80 w-80 rounded-full opacity-30 blur-3xl lg:block"
				style={{
					background:
						"radial-gradient(circle, color-mix(in oklch, var(--accent-3) 35%, transparent), transparent 70%)",
				}}
			/>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 pt-16 sm:px-6 md:pb-8 md:pt-24 lg:px-8">
				<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="space-y-6 sm:space-y-8"
					>
						<div className="space-y-4 sm:space-y-3">
							<div className="flex items-center gap-2">
								<img
									src="/itachi-idle.gif"
									alt="itachi"
									className="size-8 sm:size-10"
									decoding="async"
								/>
							</div>
							<div className="group relative flex w-fit items-center justify-center rounded-full px-3 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] sm:px-4 sm:py-1.5">
								<span
									className={cn(
										"animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
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
								<AnimatedGradientText className="text-[0.65rem] font-medium uppercase tracking-widest sm:text-sm">
									Software Engineer
								</AnimatedGradientText>
							</div>

							<h1 className="text-balance text-4xl font-light leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
								Hi, I'm{" "}
								<AuroraText
									className="font-bold"
									colors={["#4ade80", "#38bdf8", "#a78bfa", "#fbbf24"]}
								>
									Vert San
								</AuroraText>
							</h1>

							<p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground/70 sm:text-base">
								I design and build accessible, scalable, secure, and
								high-performance web and mobile applications using modern
								technologies and best practices.
							</p>
						</div>

						<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
							<RainbowButton
								size="lg"
								className="w-full justify-center gap-2 sm:w-auto"
								asChild
							>
								<Link to="/projects">
									View My Work
									<ArrowDown className="size-4" />
								</Link>
							</RainbowButton>
							<RainbowButton
								variant="outline"
								size="lg"
								className="w-full justify-center gap-2 sm:w-auto"
								asChild
							>
								<a href="/resume.pdf" download>
									<Download className="size-4" />
									Download Resume
								</a>
							</RainbowButton>
						</div>

						<div className="flex items-center gap-2 pt-2">
							{socials.map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noreferrer"
									aria-label={label}
									title={label}
									className="group flex size-10 items-center justify-center rounded-lg border border-border/50 bg-card/40 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-foreground hover:shadow-sm"
								>
									<Icon className="size-[18px] transition-transform duration-200 group-hover:scale-110" />
								</a>
							))}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
						className="flex justify-center lg:sticky lg:top-28"
					>
						<div className="w-full max-w-md">
							<PersonalInfo />
						</div>
					</motion.div>
				</div>
			</div>

			{/* featured work slider below the hero content */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
				className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8"
			>
				<div className="relative h-[360px] sm:h-[420px] lg:h-[480px]">
					<div
						aria-hidden
						className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-purple-500/10 blur-2xl"
					/>
					{slides.length >= 2 ? (
						<div className="relative size-full overflow-hidden rounded-[20px] bg-card/40">
							<MorphSlider
								items={slides}
								transition="melt"
								intensity={0.55}
								aberration={0.35}
								drift={0.4}
								autoplay
								autoplayDelay={5}
								radius={20}
							/>
							<ShineBorder
								className="z-10"
								duration={12}
								borderWidth={3}
								shineColor={["#4ade80", "#38bdf8", "#a78bfa", "#fbbf24"]}
							/>
						</div>
					) : null}
				</div>
			</motion.div>
		</section>
	);
}

import { Link } from "@tanstack/react-router";
import {
	ArrowDown,
	Award,
	Download,
	FolderKanban,
	Github,
	Linkedin,
	Mail,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AuroraText } from "#/components/ui/aurora-text";
import { useLiveContent } from "#/lib/useLiveContent";
import { cn } from "#/lib/utils";
import { AnimatedGradientText } from "#/registry/magicui/animated-gradient-text";
import { RainbowButton } from "#/registry/magicui/rainbow-button";

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
	const { items: certificates } =
		useLiveContent<Record<string, unknown>>("certificates");
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReducedMotion(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	const stats = [
		{ icon: Sparkles, label: "Years of Experience", value: "2.5+" },
		{
			icon: FolderKanban,
			label: "Projects Delivered",
			value: `${projects.length}+`,
		},
		{ icon: Award, label: "Certifications", value: `${certificates.length}+` },
	];

	return (
		<section className="relative w-full px-3 pt-3 sm:px-4 sm:pt-4">
			<div className="relative flex h-[70svh] min-h-[480px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070f] ring-1 ring-white/10 sm:rounded-3xl">
				<div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
					{reducedMotion ? (
						<img
							src="/moonwalk-poster.jpg"
							alt=""
							className="size-full object-cover"
							decoding="async"
						/>
					) : (
						<video
							className="absolute inset-0 size-full object-cover"
							autoPlay
							muted
							loop
							playsInline
							preload="auto"
							poster="/moonwalk-poster.jpg"
							tabIndex={-1}
						>
							<source src="/moonwalk-bg.webm" type="video/webm" />
							<img
								src="/moonwalk-poster.jpg"
								alt=""
								className="size-full object-cover"
								decoding="async"
							/>
						</video>
					)}
					<div className="absolute inset-0 bg-linear-to-b from-[#05070f]/45 via-[#05070f]/20 to-[#05070f]/70" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,15,0.35)_100%)]" />
				</div>

				<div
					aria-hidden
					className="pointer-events-none absolute -right-32 -top-24 z-0 h-112 w-md rounded-full opacity-40 blur-3xl"
					style={{
						background:
							"radial-gradient(circle, color-mix(in oklch, white 30%, transparent) 0%, transparent 70%)",
					}}
				/>

				<div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-8 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
					<div className="flex w-full items-start justify-end">
						<div className="group relative flex w-fit items-center justify-center gap-2.5 rounded-full px-3.5 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] sm:px-4 sm:py-2 bg-black/25 backdrop-blur-md">
							<span
								className={cn(
									"animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px",
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
							<span
								aria-hidden
								className="relative flex size-1.5 rounded-full bg-emerald-400"
								style={{ boxShadow: "0 0 10px 2px rgba(52,211,153,0.6)" }}
							/>
							<AnimatedGradientText className="text-[0.65rem] font-medium uppercase tracking-widest sm:text-sm">
								Open to opportunities
							</AnimatedGradientText>
						</div>
					</div>

					<div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
						<div className="flex w-full max-w-2xl flex-col items-start gap-6">
							<h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl [text-shadow:0_2px_30px_rgba(0,0,0,0.65)]">
								I'm{" "}
								<AuroraText
									className="font-bold"
									colors={["#4ade80", "#38bdf8", "#a78bfa", "#fbbf24"]}
								>
									Vert San
								</AuroraText>
							</h1>

							<p className="max-w-xl text-balance text-sm leading-relaxed text-white/70 sm:text-base md:text-lg [text-shadow:0_1px_14px_rgba(0,0,0,0.85)]">
								I build accessible, scalable, secure web and mobile
								applications.
							</p>

							<div className="mt-2 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-start">
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
						</div>

						<div className="flex flex-row flex-wrap items-center justify-start gap-x-8 gap-y-6 lg:w-auto lg:flex-col lg:items-end lg:gap-6">
							<div className="flex items-center gap-2.5">
								{socials.map(({ href, label, icon: Icon }) => (
									<a
										key={label}
										href={href}
										target="_blank"
										rel="noreferrer"
										aria-label={label}
										title={label}
										className="group flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white hover:shadow-md shadow-black/20"
									>
										<Icon className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
									</a>
								))}
							</div>

							<div className="flex flex-wrap items-center gap-x-8 gap-y-5">
								{stats.map(({ icon: Icon, label, value }) => (
									<div key={label} className="flex items-center gap-3">
										<div className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm">
											<Icon className="size-4" />
										</div>
										<div className="text-left leading-tight">
											<p className="text-base font-semibold text-white tabular-nums [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]">
												{value}
											</p>
											<p className="text-xs text-white/60">{label}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

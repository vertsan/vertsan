import { Link } from "@tanstack/react-router";
import {
	ArrowDown,
	ArrowUpRight,
	Award,
	Check,
	Copy,
	Download,
	FolderKanban,
	Github,
	Linkedin,
	Mail,
	MapPin,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import DitherVeil from "#/components/DitherVeil";
import { useIsDark } from "#/lib/useIsDark";
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

function StatCard({
	icon: Icon,
	label,
	value,
	href,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | null;
	href?: string;
}) {
	return (
		<div className="group flex items-center gap-3 rounded-xl p-1 transition-all duration-200 hover:opacity-90">
			<div className="flex size-9.5 items-center justify-center rounded-lg border border-black/10 bg-white/60 text-black/70 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:border-black/25 group-hover:bg-white/90 group-hover:text-black group-hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:shadow-none dark:group-hover:border-white/35 dark:group-hover:bg-white/10 dark:group-hover:text-white">
				<Icon className="size-4" />
			</div>
			<div className="text-left leading-tight">
				{value === null ? (
					<p className="text-base font-semibold text-[#0b0e17] tabular-nums dark:text-white dark:[text-shadow:0_1px_10px_rgba(0,0,0,0.8)]">
						<span className="inline-block h-4 w-10 animate-pulse rounded-sm bg-black/20 align-middle dark:bg-white/20" />
					</p>
				) : (
					<p className="flex items-center gap-1 text-base font-semibold text-[#0b0e17] tabular-nums dark:text-white dark:[text-shadow:0_1px_10px_rgba(0,0,0,0.8)]">
						{value}
						{href && (
							<ArrowUpRight className="size-3 text-black/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black/70 dark:text-white/40 dark:group-hover:text-white/80" />
						)}
					</p>
				)}
				<p className="text-xs text-black/60 dark:text-white/60">{label}</p>
			</div>
		</div>
	);
}

export default function HeroSection() {
	const {
		items: projects,
		loading: projectsLoading,
		error: projectsError,
	} = useLiveContent<HeroProject>("projects");
	const {
		items: certificates,
		loading: certificatesLoading,
		error: certificatesError,
	} = useLiveContent<Record<string, unknown>>("certificates");
	const [reducedMotion, setReducedMotion] = useState(false);
	const [copied, setCopied] = useState(false);
	const isDark = useIsDark();

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReducedMotion(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	const handleCopyEmail = (e: React.MouseEvent) => {
		e.preventDefault();
		navigator.clipboard.writeText("itsanvert@gmail.com");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const resolveCount = (
		count: number,
		loading: boolean,
		error: string | null,
	): string | null => {
		if (count > 0) return `${count}+`;
		if (error) return "–";
		if (loading) return null;
		return `${count}+`;
	};

	const stats = [
		{
			icon: Sparkles,
			label: "Years of Experience",
			value: "2.5+",
			href: "/about",
		},
		{
			icon: FolderKanban,
			label: "Projects Delivered",
			value: resolveCount(projects.length, projectsLoading, projectsError),
			href: "/projects",
		},
		{
			icon: Award,
			label: "Certifications",
			value: resolveCount(
				certificates.length,
				certificatesLoading,
				certificatesError,
			),
			href: "/certificates",
		},
	];

	return (
		<section className="relative w-full px-3 pt-3 sm:px-4 sm:pt-4">
			<div className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#eef0f4] ring-1 ring-black/5 min-h-[580px] sm:min-h-[520px] md:h-[72svh] sm:rounded-3xl shadow-2xl shadow-black/10 dark:bg-[#05070f] dark:ring-white/10 dark:shadow-black/40">
				{/* Background Dither Canvas / Fallback image */}
				<div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
					{reducedMotion ? (
						<img
							src="/Iridescent%20Chrome%20Portrait%20in%20Suit.png"
							alt=""
							className="size-full object-contain object-right mix-blend-multiply dark:mix-blend-normal"
							decoding="async"
						/>
					) : (
						<DitherVeil
							src="/Iridescent%20Chrome%20Portrait%20in%20Suit.png"
							fit="contain"
							align="center"
							pattern="floyd"
							pixelSize={2}
							levels={3}
							palette="duotone"
							colorReveal={true}
							inkColor={isDark ? "#05070f" : "#eef0f4"}
							paperColor={isDark ? "#f8fafc" : "#0b0e17"}
							contrast={1.35}
							brightness={0.08}
							revealRadius={380}
							softness={0.7}
							linger={1.5}
							rimColor="#ff3366"
							rim={0.12}
							wander={true}
							clickBurst={true}
							className="size-full"
						/>
					)}
				</div>

				{/* Atmospheric Vignette & Contrast Overlay Gradients (let pointer events pass through to DitherVeil) */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-t from-[#eef0f4] via-[#eef0f4]/50 to-transparent dark:from-[#05070f] dark:via-[#05070f]/50"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-r from-[#eef0f4]/90 via-[#eef0f4]/40 to-transparent lg:w-3/5 dark:from-[#05070f]/90 dark:via-[#05070f]/40"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_60%)]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.18),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.07),transparent_55%)]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-0 z-1 h-44 bg-gradient-to-b from-white/50 to-transparent dark:from-white/0"
				/>

				{/* Main Content Container */}
				<div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-8 px-4 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8 pointer-events-none">
					{/* Top Utility Bar */}
					<div className="flex w-full items-center justify-between gap-3">
						{/* Location / Status Pill */}
						<div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 shadow-sm backdrop-blur-md pointer-events-auto dark:border-white/10 dark:bg-black/30 dark:text-white/70 dark:shadow-none">
							<MapPin className="size-3 text-black/50 dark:text-white/50" />
							<span>Phnom Penh, Cambodia</span>
						</div>

						{/* Open to opportunities status badge */}
						<div className="group relative flex w-fit items-center justify-center gap-2 rounded-full px-3.5 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-all duration-300 hover:scale-[1.02] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] sm:px-4 sm:py-2 bg-white/70 backdrop-blur-md border border-black/10 pointer-events-auto dark:bg-black/30 dark:border-white/10">
							<span
								className={cn(
									"animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/40 via-[#9c40ff]/40 to-[#ffaa40]/40 bg-size-[300%_100%] p-px",
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
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span
									className="relative inline-flex size-2 rounded-full bg-emerald-400"
									style={{ boxShadow: "0 0 10px 2px rgba(52,211,153,0.7)" }}
								/>
							</span>
							<AnimatedGradientText className="text-[0.68rem] font-medium uppercase tracking-widest sm:text-xs">
								Open to opportunities
							</AnimatedGradientText>
						</div>
					</div>

					{/* Bottom Main Content */}
					<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
						{/* Left: Headline & Actions */}
						<div className="flex w-full max-w-2xl flex-col items-start gap-5 sm:gap-6 pointer-events-auto">
							<div className="space-y-3">
								<div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-black/60 dark:text-white/60">
									<span className="h-px w-6 bg-black/40 dark:bg-white/40" />
									Full-Stack Engineer
								</div>

								<h1 className="text-balance text-4xl font-light leading-[1.08] tracking-tight text-[#0b0e17] sm:text-6xl md:text-7xl [text-shadow:0_2px_30px_rgba(255,255,255,0.7)] dark:text-white dark:[text-shadow:0_2px_30px_rgba(0,0,0,0.8)]">
									I'm{" "}
									<span className="font-semibold bg-gradient-to-r from-[#0b0e17] via-[#0b0e17]/95 to-[#0b0e17]/70 bg-clip-text text-transparent dark:from-white dark:via-white/95 dark:to-white/70">
										Vert San
									</span>
								</h1>

								<p className="max-w-xl text-balance text-sm leading-relaxed text-[#0b0e17]/75 sm:text-base md:text-lg [text-shadow:0_1px_14px_rgba(255,255,255,0.7)] dark:text-white/75 dark:[text-shadow:0_1px_14px_rgba(0,0,0,0.9)]">
									I build accessible, scalable, and secure web & mobile
									applications with modern architecture and thoughtful UX.
								</p>
							</div>

							{/* Call to Actions & Fast Email Copy */}
							<div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-start">
								<RainbowButton
									size="lg"
									className="w-full justify-center gap-2 sm:w-auto font-medium shadow-lg shadow-black/20 pointer-events-auto dark:shadow-black/40"
									asChild
								>
									<Link to="/projects">
										Explore Projects
										<ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
									</Link>
								</RainbowButton>

								<RainbowButton
									variant="outline"
									size="lg"
									className="w-full justify-center gap-2 sm:w-auto border-black/15 bg-white/70 text-[#0b0e17] shadow-sm backdrop-blur-md hover:bg-white/90 hover:border-black/30 pointer-events-auto dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10 dark:hover:border-white/40"
									asChild
								>
									<a href="/resume.pdf" download>
										<Download className="size-4" />
										Download Resume
									</a>
								</RainbowButton>

								{/* Quick copy email button */}
								<button
									type="button"
									onClick={handleCopyEmail}
									title="Copy email address"
									className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/15 bg-white/70 px-3.5 text-xs font-medium text-black/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-black/30 hover:bg-white/90 hover:text-black pointer-events-auto dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:shadow-none dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white"
								>
									{copied ? (
										<>
											<Check className="size-3.5 text-emerald-400" />
											<span className="text-emerald-400">Copied!</span>
										</>
									) : (
										<>
											<Copy className="size-3.5 text-black/60 dark:text-white/60" />
											<span className="hidden sm:inline">Copy Email</span>
										</>
									)}
								</button>
							</div>
						</div>

						{/* Right: Socials & Interactive Stat Counters */}
						<div className="flex flex-row flex-wrap items-center justify-start gap-x-8 gap-y-6 lg:w-auto lg:flex-col lg:items-end lg:gap-6 pointer-events-auto">
							{/* Social links */}
							<div className="flex items-center gap-2.5">
								{socials.map(({ href, label, icon: Icon }) => (
									<a
										key={label}
										href={href}
										target="_blank"
										rel="noreferrer"
										aria-label={label}
										title={label}
										className="group relative flex size-10 items-center justify-center rounded-full border border-black/15 bg-white/70 text-black/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/40 hover:bg-white/90 hover:text-black hover:shadow-lg hover:shadow-black/10 dark:border-white/20 dark:bg-white/5 dark:text-white/80 dark:shadow-none dark:hover:border-white/50 dark:hover:bg-white/15 dark:hover:text-white dark:hover:shadow-black/30"
									>
										<Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
										<span className="sr-only">{label}</span>
									</a>
								))}
							</div>

							{/* Stats cards */}
							<div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8">
								{stats.map(({ icon, label, value, href }) =>
									href ? (
										<Link
											key={label}
											to={href}
											className="outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-xl dark:focus-visible:ring-white/30"
										>
											<StatCard
												icon={icon}
												label={label}
												value={value}
												href={href}
											/>
										</Link>
									) : (
										<StatCard
											key={label}
											icon={icon}
											label={label}
											value={value}
										/>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

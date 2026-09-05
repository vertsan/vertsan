import { Link } from "@tanstack/react-router";
import { Code2, Globe, Sparkles } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import DriftWall from "../ui/DriftWall";
import SectionHeading from "../ui/section-heading";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";

function useCountUp(target: number, duration = 2000) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLDivElement>(null);
	const started = useRef(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started.current) {
					started.current = true;
					const startTime = performance.now();

					const animate = (now: number) => {
						const elapsed = now - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - (1 - progress) ** 3;
						setCount(eased * target);
						if (progress < 1) requestAnimationFrame(animate);
					};
					requestAnimationFrame(animate);
				}
			},
			{ threshold: 0.3 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [target, duration]);

	return { count, ref };
}

function AnimatedStat({
	icon: Icon,
	value,
	suffix,
	label,
	decimals = 0,
}: {
	icon: (props: any) => ReactNode;
	value: number;
	suffix: string;
	label: string;
	decimals?: number;
}) {
	const { count, ref } = useCountUp(value);

	return (
		<div
			ref={ref}
			className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5"
		>
			<div className="flex items-center justify-center size-10 sm:size-12 rounded-lg sm:rounded-xl bg-primary/10 text-primary shrink-0">
				<Icon className="size-4 sm:size-5" />
			</div>
			<div>
				<p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums tracking-tight">
					{count.toFixed(decimals)}
					{suffix}
				</p>
				<p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
			</div>
		</div>
	);
}

const driftItems = [
	{ image: "/profile.jpg", title: "Profile portrait of Vert San" },
	{ image: "/profile1.jpg", title: "Vert San profile 1" },
	{ image: "/profile2.png", title: "Vert San profile 2" },
	{ image: "/profile3.jpg", title: "Vert San profile 3" },
	{ image: "/profile4.jpg", title: "Vert San profile 4" },
	{image: "/profile5.jpg", title: "Vert San profile 5" },
];

export default function AboutSection() {
	return (
		<section
			id="about"
			className="relative min-h-screen flex flex-col justify-center py-16 md:py-24 scroll-mt-20"
		>
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
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 via-transparent to-muted/30" />

			<div className="max-w-6xl mx-auto w-full relative z-10 px-4 sm:px-6">
				<Breadcrumb className="justify-center mb-8">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>About</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<SectionHeading
					className="mb-12"
					eyebrow="About me"
					title={
						<>
							Who <span className="accent-gradient-text">I Am</span>
						</>
					}
					description="Software engineer crafting accessible, performant web applications with modern technologies and clean architecture."
				/>

				<div className="grid md:grid-cols-2 gap-6 mb-6">
					<div className="relative h-[260px] sm:h-[320px] md:h-[380px] rounded-2xl border border-border/50 overflow-hidden bg-muted/20">
						<DriftWall
							items={driftItems}
							columns={3}
							tileWidth={140}
							tileHeight={110}
							gap={10}
							tilt={10}
							turn={-8}
							perspective={1000}
							depth={60}
							speed={25}
							direction="up"
							variance={0.3}
							parallax={0.4}
							lift={40}
							fade={0.5}
							dim={0.55}
							overlayColor="var(--background)"
						/>
					</div>

					<div className="rounded-2xl border border-border/50 bg-muted/20 p-6 md:p-8 flex flex-col justify-center">
						<div className="space-y-6">
							<div className="space-y-3">
								<h3 className="text-lg font-semibold text-foreground">
									A bit about me
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									I focus on building interfaces that are fast, accessible, and
									visually clean. I enjoy working across the full stack — from
									pixel-perfect frontends to robust backends.
								</p>
							</div>
							<div className="h-px bg-border/50" />
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
								<AnimatedStat
									icon={Code2}
									value={2.5}
									suffix="+"
									label="Years Experience"
									decimals={1}
								/>
								<AnimatedStat
									icon={Globe}
									value={10}
									suffix="+"
									label="Projects Delivered"
								/>
							</div>
							<div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
								<div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
									<Sparkles className="size-4" />
								</div>
								<p className="text-sm text-muted-foreground">
									Always learning, always building.
								</p>
							</div>
						</div>
					</div>
				</div>

				<ExperienceSection />
				<EducationSection />
			</div>
		</section>
	);
}

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Code2, Globe, Sparkles } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import BounceCards from "../ui/BounceCards";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";
import LetterGlitch from "../LetterGlitch";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";

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
	delay = 0,
}: {
	icon: (props: any) => ReactNode;
	value: number;
	suffix: string;
	label: string;
	decimals?: number;
	delay?: number;
}) {
	const { count, ref } = useCountUp(value);

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay, ease: "easeOut" }}
			className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-500"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
			<div className="relative flex items-center gap-4">
				<div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
					<Icon className="size-5" />
				</div>
				<div>
					<p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
						{count.toFixed(decimals)}
						{suffix}
					</p>
					<p className="text-sm text-muted-foreground/80">{label}</p>
				</div>
			</div>
		</motion.div>
	);
}

const containerVariants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.12 },
	},
};

const childVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
	},
};

const bounceImages = [
	"/profile.jpg",
	"/profile1.jpg",
	"/profile2.png",
	"/profile3.jpg",
	"/profile4.jpg",
];

const bounceAltTexts = [
	"Profile portrait of Vert San",
	"Vert San profile 1",
	"Vert San profile 2",
	"Vert San profile 3",
	"Vert San profile 4",
];

export default function AboutSection() {
	return (
		<section
			id="about"
			className="relative min-h-screen flex flex-col justify-center py-16 md:py-24 bg-muted/30 scroll-mt-20 overflow-hidden"
		>
			<FlickeringGrid
				className="absolute inset-0 z-0 h-48 md:h-64"
				squareSize={4}
				gridGap={6}
				color="#4ade80"
				maxOpacity={0.08}
				flickerChance={0.05}
				width={1600}
				height={300}
			/>
			<div className="absolute top-1/3 -left-48 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />
			<div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

			<div className="max-w-6xl mx-auto w-full relative z-10 space-y-12 px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="text-center space-y-4"
				>
					<Breadcrumb className="justify-center mb-2">
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
					
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
						Who <span className="text-primary">I Am</span>
					</h2>
					<p className="text-muted-foreground/70 text-base md:text-lg max-w-2xl mx-auto">
						Building digital experiences that make a difference
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-50px" }}
					transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
					className="flex justify-center"
				>
					<BounceCards
						images={bounceImages}
						altTexts={bounceAltTexts}
						containerWidth={400}
						containerHeight={400}
						cardSize={160}
						enableHover={true}
					/>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-50px" }}
					className="grid md:grid-cols-5 gap-8 md:gap-10 items-start"
				>
					<motion.div variants={childVariants} className="md:col-span-3">
						<div className="relative h-[340px] rounded-2xl border bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-lg overflow-hidden">
							<LetterGlitch
								glitchColors={["#4ade80", "#38bdf8", "#a78bfa"]}
								glitchSpeed={80}
								centerVignette={false}
								outerVignette={false}
								smooth={true}
								characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=:;.,"
							/>
						</div>
					</motion.div>

					<div className="md:col-span-2 space-y-4">
						<AnimatedStat
							icon={Code2}
							value={2.5}
							suffix="+"
							label="Years Experience"
							decimals={1}
							delay={0.1}
						/>
						<AnimatedStat
							icon={Globe}
							value={10}
							suffix="+"
							label="Projects Delivered"
							delay={0.2}
						/>
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
							className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-500"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<div className="relative flex items-center gap-4">
								<div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
									<Sparkles className="size-5" />
								</div>
								<div>
									<p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
										âˆž
									</p>
									<p className="text-sm text-muted-foreground/80">
										Always Learning
									</p>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>

				<ExperienceSection />
				<EducationSection />
			</div>
		</section>
	);
}

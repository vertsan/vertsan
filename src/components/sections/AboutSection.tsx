import { useEffect, useRef, useState, type ElementType } from "react";
import { Code2, Globe, Quote, Sparkles } from "lucide-react";

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
						const eased = 1 - Math.pow(1 - progress, 3);
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
	// Lucide icons accept standard svg props; allow any props so className is allowed
	icon: (props: any) => JSX.Element;
	value: number;
	suffix: string;
	label: string;
	decimals?: number;
}) {
	const { count, ref } = useCountUp(value);

	return (
		<div
			ref={ref}
			className="group flex items-center gap-4 p-5 rounded-xl border bg-background/40 backdrop-blur-sm hover:bg-background/60 hover:border-primary/20 transition-all duration-300 shadow-sm"
		>
			<div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
				<Icon className="size-5" />
			</div>
			<div>
				<p className="text-xl font-bold text-foreground tabular-nums">
					{count.toFixed(decimals)}{suffix}
				</p>
				<p className="text-sm text-muted-foreground">{label}</p>
			</div>
		</div>
	);
}

export default function AboutSection() {
	return (
		<section
			id="about"
			className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 bg-muted/30 scroll-mt-20"
		>

			<div className="max-w-5xl mx-auto w-full relative z-10 space-y-10 md:space-y-16">
				<div className="text-center space-y-3 md:space-y-4">

					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
						Who <span className="text-primary">I Am</span>
					</h2>
					<p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
						Building digital experiences that make a difference
					</p>
				</div>

				<div className="grid md:grid-cols-5 gap-8 md:gap-10 items-start">
					<div className="md:col-span-3 space-y-6">
						<div className="relative p-6 md:p-8 rounded-2xl border bg-background/50 backdrop-blur-xl shadow-lg">
							<Quote className="size-6 text-primary/30 absolute top-4 right-4" />
							<div className="space-y-4 text-muted-foreground leading-relaxed">
								<p className="text-base md:text-lg">
									I'm a software engineer & Designer from Cambodia, passionate
									about crafting digital experiences that are fast, intuitive,
									and human-centered. I work across the stack — from React and
									TypeScript on the frontend to Node.js, PostgreSQL, and
									cloud-native architectures on the backend.
								</p>
								<p className="text-base md:text-lg">
									I believe great software is built at the intersection of code,
									design, and empathy. Every project is an opportunity to solve
									real problems with clean, maintainable, and scalable
									solutions. I'm a strong advocate for TypeScript, automated
									testing, and thoughtful UX.
								</p>
								<p className="text-base md:text-lg">
									Outside of work, I contribute to open-source projects, mentor
									junior developers, and explore new tools that push the
									boundaries of what the web can do.
								</p>
							</div>
						</div>
					</div>

					<div className="md:col-span-2 space-y-4">
						<AnimatedStat icon={Code2} value={2.5} suffix="+" label="Years Experience" decimals={1} />
						<AnimatedStat icon={Globe} value={10} suffix="+" label="Projects Delivered" />
						<div className="group flex items-center gap-4 p-5 rounded-xl border bg-background/40 backdrop-blur-sm hover:bg-background/60 hover:border-primary/20 transition-all duration-300 shadow-sm">
							<div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
								<Sparkles className="size-5" />
							</div>
							<div>
								<p className="text-xl font-bold text-foreground">∞</p>
								<p className="text-sm text-muted-foreground">Always Learning</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

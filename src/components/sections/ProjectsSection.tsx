import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import gsap from "gsap";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent, setCache } from "#/lib/useLiveContent";

export interface Project {
	id?: number;
	title: string;
	slug: string;
	summary: string;
	status: string;
	startDate: string;
	endDate: string;
	image?: string | null;
	link?: string | null;
	github?: string | null;
	tags: string[];
	content: string;
}

function prefetchProjects() {
	fetch("/api/public", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ collection: "projects" }),
	})
		.then((r) => r.json())
		.then((data) => {
			if (data.items) setCache("projects", data.items);
		})
		.catch(() => {});
}

function ProjectsShimmer() {
	return (
		<section className="py-24 px-6">
			<div className="max-w-6xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-40 mx-auto" />
					<Skeleton className="h-5 w-64 mx-auto" />
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<Card key={i} className="border shadow-sm flex flex-col">
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<Skeleton className="h-6 w-36" />
									<Skeleton className="h-5 w-20 rounded-full shrink-0" />
								</div>
								<div className="pt-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4 mt-1" />
								</div>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="flex flex-wrap gap-1.5">
									{[...Array(4)].map((_, j) => (
										<Skeleton key={j} className="h-5 w-14 rounded-full" />
									))}
								</div>
							</CardContent>
							<CardFooter className="pt-0">
								<Skeleton className="h-8 w-20" />
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

const ProjectCard = memo(function ProjectCard({
	project,
}: {
	project: Project;
}) {
	return (
		<Card className="group border shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/15 transition-all duration-300 flex flex-col">
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
						{project.title}
					</CardTitle>
					<Badge
						variant={project.status === "Completed" ? "default" : "secondary"}
						className="shrink-0"
					>
						{project.status}
					</Badge>
				</div>
				<CardDescription className="line-clamp-2">
					{project.summary}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="flex flex-wrap gap-1.5">
					{project.tags?.slice(0, 6).map((tag) => (
						<Badge
							key={tag}
							variant="outline"
							className="text-xs transition-colors duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
						>
							{tag}
						</Badge>
					))}
					{project.tags && project.tags.length > 6 && (
						<Badge variant="outline" className="text-xs">
							+{project.tags.length - 6}
						</Badge>
					)}
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between gap-2 pt-0">
				<div className="flex gap-2">
					{project.github && (
						<a
							href={project.github}
							target="_blank"
							rel="noreferrer"
							className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
							aria-label="View source on GitHub"
						>
							<Github className="size-4" />
						</a>
					)}
					{project.link && (
						<a
							href={project.link}
							target="_blank"
							rel="noreferrer"
							className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
							aria-label="View live project"
						>
							<ExternalLink className="size-4" />
						</a>
					)}
				</div>
				{project.slug && (
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						asChild
						onMouseEnter={prefetchProjects}
					>
						<Link
							to="/projects/$projectId"
							params={{ projectId: project.slug }}
						>
							Details
							<ArrowUpRight className="size-3.5" />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
});

export default function ProjectsSection() {
	const { items: projects, loading } = useLiveContent<Project>("projects");
	const sectionRef = useRef<HTMLElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);

	const sortedProjects = useMemo(
		() =>
			[...projects].sort(
				(a, b) =>
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
			),
		[projects],
	);

	const animate = useCallback((el: HTMLElement) => {
		const children = el.children;
		gsap.fromTo(
			children,
			{ y: 40, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: 0.6,
				stagger: 0.08,
				ease: "power3.out",
			},
		);
	}, []);

	useEffect(() => {
		if (loading || sortedProjects.length === 0) return;

		const titleEl = titleRef.current;
		const cardsEl = cardsRef.current;
		if (!titleEl && !cardsEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					observer.unobserve(entry.target);

					if (entry.target === titleEl && titleEl) {
						gsap.fromTo(
							titleEl.children,
							{ y: 30, opacity: 0 },
							{ y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" },
						);
					}

					if (entry.target === cardsEl && cardsEl) {
						animate(cardsEl);
					}
				}
			},
			{ threshold: 0.1 },
		);

		if (titleEl) observer.observe(titleEl);
		if (cardsEl) observer.observe(cardsEl);

		return () => observer.disconnect();
	}, [loading, sortedProjects.length, animate]);

	if (loading && projects.length === 0) return <ProjectsShimmer />;

	return (
		<section
			id="projects"
			ref={sectionRef}
			className="py-24 px-6 scroll-mt-20"
		>
			<div className="max-w-6xl mx-auto space-y-12">
				<div ref={titleRef} className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Projects
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						A selection of projects I've built and contributed to
					</p>
				</div>

				<div
					ref={cardsRef}
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
				>
					{sortedProjects.map((project) => (
						<ProjectCard
							key={project.slug ?? project.title}
							project={project}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

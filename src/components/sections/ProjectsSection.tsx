import { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Github, Smartphone, Tablet } from "lucide-react";
import { marked } from "marked";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
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
	downloadAndroid?: string | null;
	downloadIos?: string | null;
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
	const renderedSummary = useMemo(
		() => (project.summary?.trim() ? marked(project.summary) : ""),
		[project.summary],
	);

	return (
		<Card className="border shadow-sm flex flex-col">
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-lg">{project.title}</CardTitle>
					<Badge
						variant={project.status === "Completed" ? "default" : "secondary"}
						className="shrink-0"
					>
						{project.status}
					</Badge>
				</div>
				{renderedSummary ? (
					<div
						className="text-sm text-muted-foreground mt-1 line-clamp-2"
						dangerouslySetInnerHTML={{ __html: renderedSummary }}
					/>
				) : (
					<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
						{project.summary}
					</p>
				)}
			</CardHeader>
			<CardContent className="flex-1 flex flex-col gap-3">
				<div className="flex flex-wrap gap-1.5">
					{project.tags?.slice(0, 6).map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
					{project.tags && project.tags.length > 6 && (
						<Badge variant="outline" className="text-xs">
							+{project.tags.length - 6}
						</Badge>
					)}
				</div>
				{(project.downloadAndroid || project.downloadIos) && (
					<div className="flex flex-wrap gap-2 pt-3 border-t border-border">
						{project.downloadAndroid && (
							<Button
								variant="default"
								size="sm"
								className="gap-1.5"
								asChild
							>
								<a
									href={`/api/download?url=${encodeURIComponent(project.downloadAndroid)}`}
								>
									<Smartphone className="size-3.5" />
									APK
								</a>
							</Button>
						)}
						{project.downloadIos && (
							<Button
								variant="default"
								size="sm"
								className="gap-1.5"
								asChild
							>
								<a
									href={`/api/download?url=${encodeURIComponent(project.downloadIos)}`}
								>
									<Tablet className="size-3.5" />
									IPA
								</a>
							</Button>
						)}
					</div>
				)}
			</CardContent>
			<CardFooter className="flex items-center justify-between gap-2 pt-0">
				<div className="flex gap-2">
					{project.github && (
						<Button variant="ghost" size="icon" asChild>
							<a
								href={project.github}
								target="_blank"
								rel="noreferrer"
								aria-label="View source on GitHub"
							>
								<Github className="size-4" />
							</a>
						</Button>
					)}
					{project.link && (
						<Button variant="ghost" size="icon" asChild>
							<a
								href={project.link}
								target="_blank"
								rel="noreferrer"
								aria-label="View live project"
							>
								<ExternalLink className="size-4" />
							</a>
						</Button>
					)}
				</div>
				{project.slug && (
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted-foreground"
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

	const sortedProjects = useMemo(
		() =>
			[...projects].sort(
				(a, b) =>
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
			),
		[projects],
	);

	if (loading && projects.length === 0) return <ProjectsShimmer />;

	return (
		<section
			id="projects"
			className="py-24 px-6 scroll-mt-20"
		>
			<div className="max-w-6xl mx-auto space-y-12">
				<div className="text-center space-y-3">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Projects
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">
						A selection of projects I've built and contributed to
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

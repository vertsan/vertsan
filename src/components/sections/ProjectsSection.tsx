import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { marked } from "marked";
import { memo, useMemo } from "react";
import { Badge } from "#/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";
import { setCache, useLiveContent } from "#/lib/useLiveContent";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";
import "#/lib/markdown";

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
		<section className="min-h-screen flex flex-col justify-center py-16 md:py-24">
			<div className="max-w-6xl mx-auto w-full space-y-12 px-4 sm:px-6">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-40 mx-auto" />
					<Skeleton className="h-5 w-64 mx-auto" />
				</div>
				<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
		<Card className="group flex flex-col border shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md overflow-hidden gap-0">
			<CardHeader className="px-5 pt-5 pb-3">
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="text-base leading-snug md:text-lg group-hover:text-primary transition-colors duration-300">
						{project.title}
					</CardTitle>
					<Badge
						variant={project.status === "Completed" ? "default" : "secondary"}
						className="shrink-0"
					>
						{project.status}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-3 px-5 pb-3 flex-1">
				{renderedSummary ? (
					<div
						className="text-sm text-muted-foreground line-clamp-2"
						dangerouslySetInnerHTML={{ __html: renderedSummary }}
					/>
				) : (
					<p className="text-sm text-muted-foreground line-clamp-2">
						{project.summary}
					</p>
				)}
				<div className="flex flex-wrap gap-1.5">
					{project.tags?.slice(0, 6).map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs font-normal">
							{tag}
						</Badge>
					))}
					{project.tags && project.tags.length > 6 && (
						<Badge variant="outline" className="text-xs font-normal">
							+{project.tags.length - 6}
						</Badge>
					)}
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between gap-2 border-t border-border/50 bg-muted/20 px-5 py-3 mt-auto">
				<div className="flex gap-1">
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
				{project.slug ? (
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
				) : (
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted-foreground"
						disabled
					>
						Details
						<ArrowUpRight className="size-3.5" />
					</Button>
				)}
			</CardFooter>
		</Card>
	);
});

export default function ProjectsSection() {
	const { items: projects, loading } = useLiveContent<Project>("projects");
	const location = useLocation();
	const showBreadcrumb =
		location.pathname === "/projects" || location.pathname === "/projects/";
	const isHome = location.pathname === "/";
	const MAX_HOME = 6;

	const sortedProjects = useMemo(
		() =>
			[...projects].sort(
				(a, b) =>
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
			),
		[projects],
	);

	const displayed = isHome ? sortedProjects.slice(0, MAX_HOME) : sortedProjects;

	if (loading && projects.length === 0) return <ProjectsShimmer />;

	return (
		<section
			id="projects"
			className="relative min-h-screen flex flex-col justify-center py-16 md:py-24 scroll-mt-20 overflow-hidden"
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
			<div className="max-w-6xl mx-auto w-full space-y-12 px-4 sm:px-6 relative z-10">
				{showBreadcrumb && (
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Projects</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				)}
				<SectionHeading
					eyebrow="Portfolio"
					title="Projects"
					description="A selection of projects I've built and contributed to"
				/>

				<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{displayed.map((project) => (
						<ProjectCard
							key={project.slug ?? project.title}
							project={project}
						/>
					))}
				</div>

				{isHome && (
					<div className="text-center">
						<Button variant="outline" asChild>
							<Link to="/projects" className="gap-2">
								See all projects
								<ArrowUpRight className="size-3.5" />
							</Link>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}

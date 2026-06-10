import { createFileRoute, Link } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import { ArrowLeft, Calendar, ExternalLink, Github } from "lucide-react";
import { marked } from "marked";
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
import { Card, CardContent } from "#/components/ui/card";

export const Route = createFileRoute("/projects/$projectId")({
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();

	const project = allProjects.find((p) => p.slug === projectId);

	if (!project) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<h1 className="text-4xl font-bold">Project Not Found</h1>
				<p className="text-muted-foreground">
					The project you're looking for doesn't exist.
				</p>
				<Button asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</div>
		);
	}

	return (
		<main className="min-h-screen py-16 px-6">
			<div className="max-w-5xl mx-auto space-y-8">
				<div className="flex items-center justify-between">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/" hash="projects">
										Projects
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{project.title}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<Button variant="ghost" size="sm" asChild>
						<Link to="/" hash="projects" className="gap-2">
							<ArrowLeft className="size-4" />
							Back
						</Link>
					</Button>
				</div>

				{project.image && (
					<div className="rounded-xl overflow-hidden border border-border shadow-sm">
						<img
							src={project.image}
							alt={project.title}
							className="w-full aspect-[21/9] object-cover"
						/>
					</div>
				)}

				<div className="space-y-4">
					<div className="flex items-start justify-between gap-4 flex-wrap">
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
							{project.title}
						</h1>
						<Badge
							variant={project.status === "Completed" ? "default" : "secondary"}
							className="shrink-0"
						>
							{project.status}
						</Badge>
					</div>
					<p className="text-lg text-muted-foreground">{project.summary}</p>
				</div>

				<div className="grid md:grid-cols-[1fr_300px] gap-8 lg:gap-12">
					<div
						className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
						dangerouslySetInnerHTML={{
							__html: marked(project.content),
						}}
					/>

					<aside className="space-y-6">
						<Card>
							<CardContent className="p-5 space-y-3">
								<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
									Timeline
								</h3>
								<div className="flex items-center gap-2 text-sm">
									<Calendar className="size-4 shrink-0 text-muted-foreground" />
									<span>
										{project.startDate} — {project.endDate}
									</span>
								</div>
							</CardContent>
						</Card>

						{(project.github || project.link) && (
							<Card>
								<CardContent className="p-5 space-y-3">
									<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
										Links
									</h3>
									<div className="space-y-2">
										{project.github && (
											<Button
												variant="outline"
												size="sm"
												className="gap-2 w-full justify-start"
												asChild
											>
												<a
													href={project.github}
													target="_blank"
													rel="noreferrer"
												>
													<Github className="size-4" />
													Source Code
												</a>
											</Button>
										)}
										{project.link && (
											<Button
												variant="outline"
												size="sm"
												className="gap-2 w-full justify-start"
												asChild
											>
												<a href={project.link} target="_blank" rel="noreferrer">
													<ExternalLink className="size-4" />
													Live Demo
												</a>
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						<Card>
							<CardContent className="p-5 space-y-3">
								<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
									Technologies
								</h3>
								<div className="flex flex-wrap gap-2">
									{project.tags.map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</aside>
				</div>
			</div>
		</main>
	);
}

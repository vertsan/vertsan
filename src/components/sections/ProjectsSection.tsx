import { Link } from "@tanstack/react-router";
import { allProjects } from "content-collections";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
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

export default function ProjectsSection() {
	const sortedProjects = [...allProjects].sort((a, b) => {
		return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
	});

	return (
		<section id="projects" className="py-24 px-6 bg-muted/30">
			<div className="max-w-6xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Projects
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						A selection of projects I've built and contributed to
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{sortedProjects.map((project) => (
						<Card
							key={project.title}
							className="border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
						>
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-lg">{project.title}</CardTitle>
									<Badge
										variant={
											project.status === "Completed" ? "default" : "secondary"
										}
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
									{project.tags.slice(0, 6).map((tag) => (
										<Badge key={tag} variant="outline" className="text-xs">
											{tag}
										</Badge>
									))}
									{project.tags.length > 6 && (
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
											className="p-2 rounded-md hover:bg-accent transition-colors"
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
											className="p-2 rounded-md hover:bg-accent transition-colors"
											aria-label="View live project"
										>
											<ExternalLink className="size-4" />
										</a>
									)}
								</div>
								<Button variant="ghost" size="sm" className="gap-1" asChild>
									<Link
										to="/projects/$projectId"
										params={{ projectId: project.slug }}
									>
										Details
										<ArrowUpRight className="size-3.5" />
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

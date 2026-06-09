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
import { useLiveContent } from "#/lib/useLiveContent";

export default function ProjectsSection() {
	const { items: projects } = useLiveContent("projects", allProjects);

	const sortedProjects = [...projects].sort((a, b) => {
		return (
			new Date((b as Record<string, unknown>).startDate as string).getTime() -
			new Date((a as Record<string, unknown>).startDate as string).getTime()
		);
	});

	return (
		<section
			id="projects"
			className="py-24 px-6 scroll-mt-20"
		>
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
							key={(project as Record<string, any>).title as string}
							className="group border shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/15 transition-all duration-300 flex flex-col"
						>
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
										{(project as Record<string, any>).title as string}
									</CardTitle>
									<Badge
										variant={
											(project as Record<string, any>).status === "Completed"
												? "default"
												: "secondary"
										}
										className="shrink-0"
									>
										{(project as Record<string, any>).status as string}
									</Badge>
								</div>
								<CardDescription className="line-clamp-2">
									{(project as Record<string, any>).summary as string}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="flex flex-wrap gap-1.5">
									{((project as Record<string, any>).tags as string[])
										?.slice(0, 6)
										.map((tag: string) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-xs transition-colors duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
											>
												{tag}
											</Badge>
										))}
									{((project as Record<string, any>).tags as string[])?.length >
										6 && (
										<Badge variant="outline" className="text-xs">
											+
											{((project as Record<string, any>).tags as string[])
												.length - 6}
										</Badge>
									)}
								</div>
							</CardContent>
							<CardFooter className="flex items-center justify-between gap-2 pt-0">
								<div className="flex gap-2">
									{(project as Record<string, any>).github && (
										<a
											href={(project as Record<string, any>).github as string}
											target="_blank"
											rel="noreferrer"
											className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
											aria-label="View source on GitHub"
										>
											<Github className="size-4" />
										</a>
									)}
									{(project as Record<string, any>).link && (
										<a
											href={(project as Record<string, any>).link as string}
											target="_blank"
											rel="noreferrer"
											className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
											aria-label="View live project"
										>
											<ExternalLink className="size-4" />
										</a>
									)}
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									asChild
								>
									<Link
										to="/projects/$projectId"
										params={{
											projectId: (project as Record<string, any>)
												.slug as string,
										}}
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

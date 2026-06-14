import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, ExternalLink, Github, Smartphone, Tablet } from "lucide-react";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";
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
import { Separator } from "#/components/ui/separator";
import { Loader2 } from "lucide-react";
import { getCache, setCache } from "#/lib/useLiveContent";
import "#/lib/markdown";

interface Project {
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

export const Route = createFileRoute("/projects/$projectId")({
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();

	const [project, setProject] = useState<Project | undefined>(() => {
		const cached = getCache<Project>("projects");
		return cached ? cached.find((p) => p.slug === projectId) : undefined;
	});
	const [loading, setLoading] = useState(!project);

	useEffect(() => {
		const cached = getCache<Project>("projects");
		const foundInCache = cached ? cached.find((p) => p.slug === projectId) : undefined;

		if (foundInCache) {
			setProject(foundInCache);
			setLoading(false);
			return;
		}

		setLoading(true);
		fetch("/api/public", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ collection: "projects" }),
		})
			.then((r) => r.json())
			.then((data) => {
				const items = (data.items ?? []) as Project[];
				setCache("projects", items);

				const found = items.find((p) => p.slug === projectId);
				setProject(found);
			})
			.catch(() => {
				setProject(undefined);
			})
			.finally(() => setLoading(false));
	}, [projectId]);

	const renderedContent = useMemo(
		() => (project?.content?.trim() ? marked(project.content) : ""),
		[project?.content],
	);

	if (loading) {
		return (
			<main className="min-h-[60vh] flex items-center justify-center">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</main>
		);
	}

	if (!project) {
		return (
			<main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
				<h1 className="text-4xl font-bold">Project Not Found</h1>
				<p className="text-muted-foreground">
					The project you're looking for doesn't exist.
				</p>
				<Button asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</main>
		);
	}

	const hasDownloads = project.downloadAndroid || project.downloadIos;

	return (
		<main className="min-h-screen">
			<article className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
				<div className="mb-8 flex items-center justify-between">
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
									<Link to="/projects">Projects</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{project.title}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button variant="ghost" size="sm" asChild>
						<Link to="/projects" className="gap-2">
							<ArrowLeft className="size-4" />
							Back
						</Link>
					</Button>
				</div>

				<header className="mb-10 space-y-6">
					<div className="space-y-3">
						<div className="flex items-start justify-between gap-4 flex-wrap">
							<h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
								{project.title}
							</h1>
							<Badge
								variant={project.status === "Completed" ? "default" : "secondary"}
								className="shrink-0 text-sm px-3 py-1"
							>
								{project.status}
							</Badge>
						</div>
						<p className="text-xl text-muted-foreground leading-relaxed">
							{project.summary}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<Calendar className="size-4" />
							<time dateTime={project.startDate}>
								{project.startDate}
							</time>
							<span>—</span>
							<time dateTime={project.endDate}>
								{project.endDate}
							</time>
						</div>
						<div className="flex flex-wrap gap-1.5">
							{project.tags.map((tag) => (
								<Badge key={tag} variant="outline" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</header>

				{project.image && (
					<div className="mb-12 rounded-2xl overflow-hidden border border-border shadow-lg">
						<img
							src={project.image}
							alt={project.title}
							className="w-full aspect-[21/9] object-cover"
						/>
					</div>
				)}

				{renderedContent && (
					<div
						className="prose prose-lg dark:prose-invert max-w-none leading-relaxed mb-12"
						dangerouslySetInnerHTML={{ __html: renderedContent }}
					/>
				)}

				{(hasDownloads || project.github || project.link) && (
					<>
						<Separator className="my-12" />
						<div className="space-y-6">
							<h2 className="text-2xl font-bold tracking-tight">Resources</h2>
							<div className="flex flex-wrap gap-3">
								{project.downloadAndroid && (
									<Button
										variant="default"
										size="lg"
										className="gap-2"
										asChild
									>
										<a
											href={`/api/download?url=${encodeURIComponent(project.downloadAndroid)}`}
										>
											<Smartphone className="size-5" />
											Download APK
										</a>
									</Button>
								)}
								{project.downloadIos && (
									<Button
										variant="default"
										size="lg"
										className="gap-2"
										asChild
									>
										<a
											href={`/api/download?url=${encodeURIComponent(project.downloadIos)}`}
										>
											<Tablet className="size-5" />
											Download iOS
										</a>
									</Button>
								)}
								{project.github && (
									<Button
										variant="outline"
										size="lg"
										className="gap-2"
										asChild
									>
										<a
											href={project.github}
											target="_blank"
											rel="noreferrer"
										>
											<Github className="size-5" />
											Source Code
										</a>
									</Button>
								)}
								{project.link && (
									<Button
										variant="outline"
										size="lg"
										className="gap-2"
										asChild
									>
										<a href={project.link} target="_blank" rel="noreferrer">
											<ExternalLink className="size-5" />
											Live Demo
										</a>
									</Button>
								)}
							</div>
						</div>
					</>
				)}

				<Separator className="my-12" />

				<div className="rounded-xl border border-border bg-muted/30 p-6 space-y-4">
					<h2 className="text-xl font-bold tracking-tight">Demo Accounts</h2>
					<p className="text-sm text-muted-foreground">
						Use these credentials to test the application:
					</p>
					<div className="overflow-x-auto rounded-lg border border-border">
						<table className="w-full border-collapse text-sm">
							<thead>
								<tr className="bg-muted">
									<th className="text-left p-3 font-semibold border-r border-border">Role</th>
									<th className="text-left p-3 font-semibold border-r border-border">Email</th>
									<th className="text-left p-3 font-semibold">Password</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ role: "Super Admin", email: "superadmin@gmail.com" },
									{ role: "Admin", email: "admin@gmail.com" },
									{ role: "Teacher", email: "teacher@gmail.com" },
									{ role: "Student", email: "student@gmail.com" },
								].map((account, i) => (
									<tr key={account.role} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
										<td className="p-3 border-r border-border font-medium">{account.role}</td>
										<td className="p-3 border-r border-border font-mono text-xs">{account.email}</td>
										<td className="p-3 font-mono text-xs">12345678</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<Separator className="my-12" />

				<div className="text-center">
					<Button variant="ghost" asChild>
						<Link to="/projects" className="gap-2">
							<ArrowLeft className="size-4" />
							Back to all projects
						</Link>
					</Button>
				</div>
			</article>
		</main>
	);
}

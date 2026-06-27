import { Briefcase, Calendar } from "lucide-react";
import { marked } from "marked";
import { useMemo } from "react";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { TracingBeam } from "#/components/ui/tracing-beam";
import { useLiveContent } from "#/lib/useLiveContent";

interface Job {
	id?: number;
	jobTitle: string;
	company: string;
	location: string;
	summary: string;
	startDate: string;
	endDate: string | null;
	tags: string[];
	content: string;
}

function ExperienceShimmer() {
	return (
		<section className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 ">
			<div className="max-w-4xl mx-auto w-full space-y-12">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-48 mx-auto" />
					<Skeleton className="h-5 w-72 mx-auto" />
				</div>
				<div className="space-y-8">
					{[...Array(3)].map((_, i) => (
						<Card key={i} className="border shadow-sm">
							<CardHeader>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
									<div className="space-y-2">
										<Skeleton className="h-6 w-56" />
										<Skeleton className="h-4 w-40" />
									</div>
									<Skeleton className="h-4 w-32" />
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<div className="flex gap-2 pt-2">
									<Skeleton className="h-5 w-16 rounded-full" />
									<Skeleton className="h-5 w-20 rounded-full" />
									<Skeleton className="h-5 w-14 rounded-full" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

const renderContent = (content: string) =>
	marked(content, { async: false, breaks: true });

export default function ExperienceSection() {
	const { items: jobs, loading } = useLiveContent<Job>("jobs");

	const sortedJobs = useMemo(
		() =>
			[...jobs].sort(
				(a, b) =>
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
			),
		[jobs],
	);

	if (loading && jobs.length === 0) return <ExperienceShimmer />;

	return (
		<section
			id="experience"
			className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6  scroll-mt-20"
		>
			<div className="max-w-4xl mx-auto w-full space-y-12">
				<div className="text-center space-y-4">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
						Experience
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
						My professional journey in software development
					</p>
				</div>

				<TracingBeam>
					<div className="space-y-6 md:space-y-8">
						{sortedJobs.map((job) => (
							<Card key={job.jobTitle} className="border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/10 transition-all duration-300 gap-4 md:gap-6 py-4 md:py-6">
								<CardHeader className="px-4 md:px-6">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<Briefcase className="size-4 text-primary shrink-0" />
												<CardTitle className="text-lg md:text-xl">
													{job.jobTitle}
												</CardTitle>
											</div>
											<p className="text-primary font-medium">
												{job.company} &middot; {job.location}
											</p>
										</div>
										<div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
											<Calendar className="size-3.5" />
											<span>
												{job.startDate} — {job.endDate ?? "Present"}
											</span>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4 px-4 md:px-6">
									<p className="text-muted-foreground leading-relaxed">
										{job.summary}
									</p>

									{job.content && (
										<div
											className="text-muted-foreground/80 text-sm space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:leading-relaxed [&_p]:mb-0"
											dangerouslySetInnerHTML={{
												__html: renderContent(job.content),
											}}
										/>
									)}

									<div className="flex flex-wrap gap-2 pt-2">
										{job.tags?.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-xs transition-colors duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
											>
												{tag}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TracingBeam>
			</div>
		</section>
	);
}

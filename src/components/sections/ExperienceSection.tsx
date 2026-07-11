import { Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
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
			className="relative min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20 overflow-hidden"
		>
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/10 via-background to-muted/20" />
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_20%_50%,rgba(79,184,178,0.06),transparent)]" />
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_90%_20%,rgba(56,189,248,0.05),transparent)]" />
			<div className="max-w-4xl mx-auto w-full space-y-10 md:space-y-12">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="text-center space-y-3 md:space-y-4"
				>
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
						Experience
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
						My professional journey in software development
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-50px" }}
					transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
				>
					<TracingBeam>
					<div className="space-y-5 md:space-y-8">
						{sortedJobs.map((job) => (
							<Card key={job.jobTitle} className="border shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/10 transition-all duration-300 gap-2 md:gap-6 py-3 md:py-6">
								<CardHeader className="px-2 md:px-6">
									<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
										<div className="space-y-0.5 sm:space-y-1 min-w-0">
											<div className="flex items-center gap-1.5 sm:gap-2">
												<Briefcase className="size-3.5 sm:size-4 text-primary shrink-0 mt-0.5" />
												<CardTitle className="text-sm sm:text-lg md:text-xl leading-snug sm:leading-none">
													{job.jobTitle}
												</CardTitle>
											</div>
											<p className="text-primary font-medium text-sm sm:text-base flex flex-col sm:block leading-tight sm:leading-normal">
												<span>{job.company}</span>
												<span className="hidden sm:inline"> &middot; </span>
												<span className="text-xs sm:text-base">{job.location}</span>
											</p>
										</div>
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
											<Calendar className="size-3" />
											<span className="whitespace-nowrap">
												{job.startDate} — {job.endDate ?? "Present"}
											</span>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-3 md:space-y-4 px-2 md:px-6">
									<p className="text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base">
										{job.summary}
									</p>

									{job.content && (
										<div
											className="text-muted-foreground/80 text-xs sm:text-sm space-y-1.5 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:leading-relaxed [&_p]:mb-0"
											dangerouslySetInnerHTML={{
												__html: renderContent(job.content),
											}}
										/>
									)}

									<div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
										{job.tags?.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-[0.6rem] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5 transition-colors duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
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
				</motion.div>
			</div>
		</section>
	);
}

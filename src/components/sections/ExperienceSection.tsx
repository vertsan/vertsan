import { Briefcase, Calendar } from "lucide-react";
import { marked } from "marked";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent } from "#/lib/useLiveContent";

function ExperienceShimmer() {
	return (
		<section className="py-24 px-6 bg-muted/30">
			<div className="max-w-4xl mx-auto space-y-12">
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

export default function ExperienceSection() {
	const { items: jobs, loading } = useLiveContent<Record<string, unknown>>("jobs");

	if (loading && jobs.length === 0) return <ExperienceShimmer />;

	const sortedJobs = [...jobs].sort((a, b) => {
		return (
			new Date(b.startDate as string).getTime() -
			new Date(a.startDate as string).getTime()
		);
	});

	return (
		<section
			id="experience"
			className="py-24 px-6 bg-muted/30 scroll-mt-20"
		>
			<div className="max-w-4xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Experience
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						My professional journey in software development
					</p>
				</div>

				<div className="relative">
					<div className="absolute left-8 top-0 bottom-0 w-px bg-border/60 hidden md:block" />

					<div className="space-y-8">
						{sortedJobs.map((job) => (
							<div
								key={(job as Record<string, any>).jobTitle as string}
								className="relative pl-0 md:pl-20"
							>
								<div className="absolute left-[1.85rem] top-6 w-3.5 h-3.5 rounded-full bg-primary border-[3px] border-background hidden md:block shadow-sm" />

								<Card className="border shadow-sm hover:shadow-lg hover:border-primary/10 transition-all duration-300">
									<CardHeader>
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<Briefcase className="size-4 text-primary shrink-0" />
													<CardTitle className="text-xl">
														{(job as Record<string, any>).jobTitle as string}
													</CardTitle>
												</div>
												<p className="text-primary font-medium">
													{(job as Record<string, any>).company as string}{" "}
													&middot;{" "}
													{(job as Record<string, any>).location as string}
												</p>
											</div>
											<div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
												<Calendar className="size-3.5" />
												<span>
													{(job as Record<string, any>).startDate as string} —{" "}
													{(job as Record<string, any>).endDate
														? ((job as Record<string, any>).endDate as string)
														: "Present"}
												</span>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-muted-foreground leading-relaxed">
											{(job as Record<string, any>).summary as string}
										</p>
										{(job as Record<string, any>).content && (
											<div
												className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none leading-relaxed"
												dangerouslySetInnerHTML={{
													__html: marked(
														(job as Record<string, any>).content as string,
													),
												}}
											/>
										)}
										<div className="flex flex-wrap gap-2 pt-2">
											{((job as Record<string, any>).tags as string[])?.map(
												(tag: string) => (
													<Badge
														key={tag}
														variant="outline"
														className="text-xs transition-colors duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
													>
														{tag}
													</Badge>
												),
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

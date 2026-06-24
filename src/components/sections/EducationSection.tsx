import { useMemo } from "react";
import { Calendar, GraduationCap } from "lucide-react";
import { marked } from "marked";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent } from "#/lib/useLiveContent";

interface Education {
	id?: number;
	school: string;
	summary: string;
	startDate: string;
	endDate: string | null;
	tags: string[];
	content: string;
}

function EducationShimmer() {
	return (
		<section className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
			<div className="max-w-4xl mx-auto w-full space-y-12">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-40 mx-auto" />
					<Skeleton className="h-5 w-64 mx-auto" />
				</div>
				<div className="space-y-6">
					{[...Array(2)].map((_, i) => (
						<Card key={i} className="border shadow-sm">
							<CardHeader>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
									<div className="space-y-2">
										<Skeleton className="h-6 w-48" />
										<Skeleton className="h-4 w-36" />
									</div>
									<Skeleton className="h-4 w-28" />
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
								<div className="flex gap-2 pt-1">
									<Skeleton className="h-5 w-16 rounded-full" />
									<Skeleton className="h-5 w-20 rounded-full" />
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

export default function EducationSection() {
	const { items: education, loading } = useLiveContent<Education>("education");

	const sortedEducation = useMemo(
		() =>
			[...education].sort(
				(a, b) =>
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
			),
		[education],
	);

	if (loading && education.length === 0) return <EducationShimmer />;

	return (
		<section
			id="education"
			className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 bg-muted/30 scroll-mt-20"
		>
			<div className="max-w-4xl mx-auto w-full space-y-12">
				<div className="text-center space-y-4">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
						Education
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
						My academic background and continuous learning
					</p>
				</div>

				<div className="space-y-4 md:space-y-6">
					{sortedEducation.map((edu) => (
						<Card
							key={edu.school}
							className="border shadow-sm hover:shadow-lg hover:border-primary/10 transition-all duration-300 gap-4 md:gap-6 py-4 md:py-6"
						>
							<CardHeader className="px-4 md:px-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<GraduationCap className="size-4 text-primary shrink-0" />
											<CardTitle className="text-lg md:text-xl">
												{edu.school}
											</CardTitle>
										</div>
										<p className="text-muted-foreground font-medium">
											{edu.summary}
										</p>
									</div>
									<div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
										<Calendar className="size-3.5" />
										<span>
											{edu.startDate} — {edu.endDate ?? "Present"}
										</span>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 px-4 md:px-6">
								{edu.content && (
									<div
										className="text-muted-foreground/80 text-sm space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:leading-relaxed [&_p]:mb-0"
										dangerouslySetInnerHTML={{
											__html: renderContent(edu.content),
										}}
									/>
								)}
								<div className="flex flex-wrap gap-2">
									{edu.tags?.map((tag) => (
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
			</div>
		</section>
	);
}

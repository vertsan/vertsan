import { allEducations } from "content-collections";
import { Calendar, GraduationCap } from "lucide-react";
import { marked } from "marked";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

export default function EducationSection() {
	const sortedEducation = [...allEducations].sort((a, b) => {
		return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
	});

	return (
		<section id="education" className="py-24 px-6">
			<div className="max-w-4xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Education
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						My academic background and continuous learning
					</p>
				</div>

				<div className="space-y-6">
					{sortedEducation.map((edu) => (
						<Card
							key={edu.school}
							className="border shadow-sm hover:shadow-md transition-shadow"
						>
							<CardHeader>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<GraduationCap className="size-4 text-primary" />
											<CardTitle className="text-xl">{edu.school}</CardTitle>
										</div>
										<p className="text-muted-foreground font-medium">
											{edu.summary}
										</p>
									</div>
									<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
										<Calendar className="size-3.5" />
										<span>
											{edu.startDate} — {edu.endDate || "Present"}
										</span>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{edu.content && (
									<div
										className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none leading-relaxed"
										dangerouslySetInnerHTML={{
											__html: marked(edu.content),
										}}
									/>
								)}
								<div className="flex flex-wrap gap-2">
									{edu.tags.map((tag) => (
										<Badge key={tag} variant="outline" className="text-xs">
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

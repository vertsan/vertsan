import { allTechnologies } from "content-collections";
import { Badge } from "#/components/ui/badge";
import { useLiveContent } from "#/lib/useLiveContent";

export default function TechnologiesSection() {
	const { items: technologies } = useLiveContent(
		"technologies",
		allTechnologies,
	);

	const categories = [...technologies].sort((a, b) => {
		const ca = String((a as Record<string, any>).category ?? "");
		const cb = String((b as Record<string, any>).category ?? "");
		return ca.localeCompare(cb);
	});

	return (
		<section
			id="technologies"
			className="py-24 px-6 scroll-mt-20"
		>
			<div className="max-w-5xl mx-auto space-y-16">
				<div className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Technologies & Tools
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Technologies I work with regularly to build modern web applications
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{categories.map((category, i) => (
						<div
							key={(category as Record<string, any>).category as string}
							className="group p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
						>
							<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
								<span className="w-1 h-5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-300" />
								{(category as Record<string, any>).category as string}
							</h3>
							<div className="flex flex-wrap gap-2">
								{((category as Record<string, any>).items as string[])?.map(
									(tech: string) => (
										<Badge
											key={tech}
											variant="secondary"
											className="px-3 py-1.5 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary"
										>
											{tech}
										</Badge>
									),
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

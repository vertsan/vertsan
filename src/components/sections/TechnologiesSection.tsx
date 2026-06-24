import { Badge } from "#/components/ui/badge";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent } from "#/lib/useLiveContent";

function TechnologiesShimmer() {
	return (
		<section className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6">
			<div className="max-w-5xl mx-auto w-full space-y-16">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-56 mx-auto" />
					<Skeleton className="h-5 w-80 mx-auto" />
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
						>
							<div className="flex items-center gap-2 mb-4">
								<Skeleton className="w-1 h-5 rounded-full" />
								<Skeleton className="h-5 w-32" />
							</div>
							<div className="flex flex-wrap gap-2">
								{[...Array(6)].map((_, j) => (
									<Skeleton key={j} className="h-7 w-16 rounded-full" />
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function TechnologiesSection() {
	const { items: technologies, loading } = useLiveContent<Record<string, unknown>>(
		"technologies",
	);

	if (loading && technologies.length === 0) return <TechnologiesShimmer />;

	const categories = [...technologies].sort((a, b) => {
		const ca = String((a as Record<string, any>).category ?? "");
		const cb = String((b as Record<string, any>).category ?? "");
		return ca.localeCompare(cb);
	});

	return (
		<section
			id="technologies"
			className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 scroll-mt-20"
		>
			<div className="max-w-5xl mx-auto w-full space-y-10 md:space-y-16">
				<div className="text-center space-y-3 md:space-y-4">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
						Technologies & Tools
					</h2>
					<p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
						Technologies I work with regularly to build modern web applications
					</p>
				</div>

				<div className="grid gap-4 md:gap-6 md:grid-cols-2">
					{categories.map((category) => (
						<div
							key={(category as Record<string, any>).category as string}
							className="group p-4 md:p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
						>
							<h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
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

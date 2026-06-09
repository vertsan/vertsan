import { Badge } from "#/components/ui/badge";

const techCategories = [
	{
		name: "Frontend",
		items: [
			"React",
			"TypeScript",
			"TanStack",
			"Tailwind CSS",
			"shadcn",
			"Next.js",
			"Vite",
			"Redux",
			"HTML/CSS",
			"Radix UI",
		],
	},
	{
		name: "Backend",
		items: [
			"Node.js",
			"Express",
			"PostgreSQL",
			"MongoDB",
			"Redis",
			"REST APIs",
			"GraphQL",
			"WebSockets",
		],
	},
	{
		name: "DevOps & Tools",
		items: [
			"Docker",
			"AWS",
			"CI/CD",
			"Git",
			"Linux",
			"Vite",
			"Biome",
			"Vitest",
		],
	},
	{
		name: "Languages",
		items: ["TypeScript", "JavaScript", "Python", "SQL", "Bash"],
	},
];

export default function TechnologiesSection() {
	return (
		<section id="technologies" className="py-24 px-6">
			<div className="max-w-5xl mx-auto space-y-16">
				<div className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Technologies & Tools
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Technologies I work with regularly to build modern web applications
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					{techCategories.map((category) => (
						<div
							key={category.name}
							className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
						>
							<h3 className="text-lg font-semibold mb-4">{category.name}</h3>
							<div className="flex flex-wrap gap-2">
								{category.items.map((tech) => (
									<Badge
										key={tech}
										variant="secondary"
										className="px-3 py-1.5 text-sm"
									>
										{tech}
									</Badge>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

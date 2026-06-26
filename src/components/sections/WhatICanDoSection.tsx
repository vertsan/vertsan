import {
	Cloud,
	Database,
	type LucideIcon,
	Monitor,
	Palette,
	Server,
	Smartphone,
} from "lucide-react";

interface Service {
	icon: LucideIcon;
	title: string;
	description: string;
}

const services: Service[] = [
	{
		icon: Monitor,
		title: "Frontend Development",
		description:
			"Responsive, accessible, and performant UI components using React, TypeScript, and modern CSS frameworks like Tailwind CSS.",
	},
	{
		icon: Server,
		title: "Backend Development",
		description:
			"Scalable server-side applications with Node.js, RESTful APIs, and serverless functions on cloud platforms.",
	},
	{
		icon: Smartphone,
		title: "Mobile Development",
		description:
			"Cross-platform mobile applications using React Native, delivering native-like experiences across iOS and Android.",
	},
	{
		icon: Database,
		title: "Database Design",
		description:
			"Efficient data modeling and management with SQL, PostgreSQL, and ORM tools like Drizzle ORM.",
	},
	{
		icon: Cloud,
		title: "Cloud & DevOps",
		description:
			"Deployment and infrastructure management on AWS, Netlify, and Vercel with CI/CD pipelines.",
	},
	{
		icon: Palette,
		title: "UI/UX Design",
		description:
			"Clean, intuitive interfaces with a focus on user experience, accessibility, and visual consistency.",
	},
];

export default function WhatICanDoSection() {
	return (
		<section
			id="what-i-can-do"
			className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-4 sm:px-6 scroll-mt-20"
		>
			<div className="max-w-5xl mx-auto w-full space-y-10 md:space-y-16">
				<div className="text-center space-y-3 md:space-y-4">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
						What I Can Do
					</h2>
					<p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
						Services and expertise I bring to every project
					</p>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{services.map(({ icon: Icon, title, description }) => (
						<div
							key={title}
							className="group p-5 md:p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300"
						>
							<div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
								<Icon className="size-5" />
							</div>
							<h3 className="text-base md:text-lg font-semibold mb-2">
								{title}
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

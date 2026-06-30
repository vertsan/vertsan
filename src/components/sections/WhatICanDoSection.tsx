import {
	Cloud,
	Database,
	type LucideIcon,
	Monitor,
	Palette,
	Server,
	Smartphone,
} from "lucide-react";
import { GlowingEffect } from "#/components/ui/glowing-effect";

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
			"Responsive, accessible, and performant UI using React, TypeScript, Tailwind CSS, DevExpress, and GSAP for rich interactive experiences.",
	},
	{
		icon: Server,
		title: "Backend Development",
		description:
			"Scalable server-side applications with Node.js, ASP.NET Core, Laravel, RESTful and GraphQL APIs on cloud platforms.",
	},
	{
		icon: Smartphone,
		title: "Mobile Development",
		description:
			"Cross-platform mobile applications using Flutter, delivering native-like experiences across iOS and Android.",
	},
	{
		icon: Database,
		title: "Database Design",
		description:
			"Efficient data modeling and management with SQL, PostgreSQL, Neon, and ORM tools like Drizzle ORM.",
	},
	{
		icon: Cloud,
		title: "Cloud & DevOps",
		description:
			"Infrastructure and deployment on AWS (EC2, ECS, S3, RDS, Fargate), Docker, GitHub Actions, with CI/CD pipelines.",
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

				<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{services.map(({ icon: Icon, title, description }) => (
						<li key={title} className="min-h-[14rem] list-none">
							<div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
								<GlowingEffect
									blur={0}
									borderWidth={3}
									spread={80}
									glow={true}
									disabled={false}
									proximity={64}
									inactiveZone={0.01}
								/>
								<div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 border-0.75 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
									<div className="relative flex flex-1 flex-col justify-between gap-3">
										<div className="w-fit rounded-lg border border-gray-600 p-2">
											<Icon className="h-4 w-4 text-black dark:text-neutral-400" />
										</div>
										<div className="space-y-3">
											<h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
												{title}
											</h3>
											<p className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400">
												{description}
											</p>
										</div>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

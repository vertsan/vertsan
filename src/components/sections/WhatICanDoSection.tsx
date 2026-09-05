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
import SectionHeading from "#/components/ui/section-heading";

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
			className="flex min-h-screen flex-col justify-center py-16 px-4 sm:px-6 md:py-24 scroll-mt-20"
		>
			<div className="max-w-5xl mx-auto w-full space-y-10 md:space-y-16">
				<SectionHeading
					eyebrow="Services"
					title="What I Can Do"
					description="Services and expertise I bring to every project"
				/>

				<div>
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
											<div className="w-fit rounded-lg border border-border bg-background/40 p-2.5">
												<Icon className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="space-y-3">
												<h3 className="pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-foreground md:text-2xl/[1.875rem]">
													{title}
												</h3>
												<p className="font-sans text-sm/[1.125rem] text-muted-foreground md:text-base/[1.375rem]">
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
			</div>
		</section>
	);
}

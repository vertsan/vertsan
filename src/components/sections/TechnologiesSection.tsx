import {
	SiCss,
	SiDocker,
	SiDrizzle,
	SiExpress,
	SiFigma,
	SiFirebase,
	SiGit,
	SiGithub,
	SiGo,
	SiGraphql,
	SiHtml5,
	SiJavascript,
	SiLinux,
	SiMongodb,
	SiMui,
	SiNextdotjs,
	SiNodedotjs,
	SiPostgresql,
	SiPython,
	SiReact,
	SiReactquery,
	SiReactrouter,
	SiRedis,
	SiShadcnui,
	SiSqlite,
	SiTailwindcss,
	SiTypescript,
	SiVite,
} from "react-icons/si";
import LogoLoop from "#/components/LogoLoop";

const techLogos = [
	{ node: <SiReact />, title: "React", href: "https://react.dev" },
	{ node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
	{ node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
	{ node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
	{ node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
	{ node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
	{ node: <SiCss />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
	{ node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
	{ node: <SiExpress />, title: "Express", href: "https://expressjs.com" },
	{ node: <SiPython />, title: "Python", href: "https://www.python.org" },
	{ node: <SiGo />, title: "Go", href: "https://go.dev" },
	{ node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
	{ node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
	{ node: <SiSqlite />, title: "SQLite", href: "https://www.sqlite.org" },
	{ node: <SiRedis />, title: "Redis", href: "https://redis.io" },
	{ node: <SiDrizzle />, title: "Drizzle ORM", href: "https://orm.drizzle.team" },
	{ node: <SiGraphql />, title: "GraphQL", href: "https://graphql.org" },
	{ node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
	{ node: <SiFirebase />, title: "Firebase", href: "https://firebase.google.com" },
	{ node: <SiGit />, title: "Git", href: "https://git-scm.com" },
	{ node: <SiGithub />, title: "GitHub", href: "https://github.com" },
	{ node: <SiLinux />, title: "Linux", href: "https://www.linux.org" },
	{ node: <SiVite />, title: "Vite", href: "https://vitejs.dev" },
	{ node: <SiReactrouter />, title: "React Router", href: "https://reactrouter.com" },
	{ node: <SiReactquery />, title: "TanStack Query", href: "https://tanstack.com/query" },
	{ node: <SiMui />, title: "Material UI", href: "https://mui.com" },
	{ node: <SiShadcnui />, title: "shadcn/ui", href: "https://ui.shadcn.com" },
	{ node: <SiFigma />, title: "Figma", href: "https://www.figma.com" },
];

interface TechnologiesSectionProps {
	compact?: boolean;
}

export default function TechnologiesSection({ compact = false }: TechnologiesSectionProps) {
	if (compact) {
		return (
			<section id="technologies" className="w-full">
				<div className=" backdrop-blur-xl sm:p-4 md:p-5">
					<div className="overflow-hidden   p-2 ">
						<LogoLoop
							logos={techLogos}
							speed={95}
							direction="left"
							logoHeight={56}
							gap={40}
							hoverSpeed={0}
							scaleOnHover
							fadeOut
							ariaLabel="Technologies I work with"
						/>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id="technologies"
			className="flex min-h-screen flex-col justify-center bg-muted/30 px-4 py-16 scroll-mt-20 sm:px-6 md:py-24"
		>
			<div className="mx-auto w-full max-w-5xl space-y-10 md:space-y-16">
				<div className="text-center space-y-3 md:space-y-4">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
						Technologies & Tools
					</h2>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
						Technologies I work with regularly to build modern web applications
					</p>
				</div>

				<div className="relative overflow-hidden rounded-[30px] border border-border/80 bg-background/70 px-3 py-6 shadow-[0_40px_140px_-50px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:px-5 sm:py-8">
					<LogoLoop
						logos={techLogos}
						speed={100}
						direction="left"
						logoHeight={64}
						gap={64}
						hoverSpeed={0}
						scaleOnHover
						fadeOut
						ariaLabel="Technologies I work with"
					/>
				</div>
			</div>
		</section>
	);
}

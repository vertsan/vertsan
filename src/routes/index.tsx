import { createFileRoute } from "@tanstack/react-router";
import ResumeAssistant from "#/components/ResumeAssistant";
import CertificatesSection from "#/components/sections/CertificatesSection";
import EducationSection from "#/components/sections/EducationSection";
import ExperienceSection from "#/components/sections/ExperienceSection";
import HeroSection from "#/components/sections/HeroSection";
import ProjectsSection from "#/components/sections/ProjectsSection";
import TechnologiesSection from "#/components/sections/TechnologiesSection";
import { DataProvider } from "#/lib/data-context";
import { createCertificateService } from "#/services/certificate.service";
import { createEducationService } from "#/services/education.service";
import { createJobService } from "#/services/job.service";
import { createProjectService } from "#/services/project.service";
import { createTechnologyService } from "#/services/technology.service";

export const Route = createFileRoute("/")({
	loader: async () => {
		const [projects, jobs, education, certificates, technologies] =
			await Promise.all([
				createProjectService().list(),
				createJobService().list(),
				createEducationService().list(),
				createCertificateService().list(),
				createTechnologyService().list(),
			]);
		return { projects, jobs, education, certificates, technologies };
	},
	component: Home,
});

function Home() {
	const data = Route.useLoaderData();
	return (
		<DataProvider data={data}>
			<ResumeAssistant />
			<HeroSection />
			<TechnologiesSection />
			<ExperienceSection />
			<EducationSection />
			<ProjectsSection />
			<CertificatesSection />
		</DataProvider>
	);
}

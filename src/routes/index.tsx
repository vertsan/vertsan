import { createFileRoute } from "@tanstack/react-router";
import ResumeAssistant from "#/components/ResumeAssistant";
import CertificatesSection from "#/components/sections/CertificatesSection";
import EducationSection from "#/components/sections/EducationSection";
import ExperienceSection from "#/components/sections/ExperienceSection";
import HeroSection from "#/components/sections/HeroSection";
import ProjectsSection from "#/components/sections/ProjectsSection";
import TechnologiesSection from "#/components/sections/TechnologiesSection";
import { DataProvider } from "#/lib/data-context";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<DataProvider data={{ projects: [], jobs: [], education: [], certificates: [], technologies: [] }}>
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

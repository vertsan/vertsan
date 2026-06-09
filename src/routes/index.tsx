import { createFileRoute } from "@tanstack/react-router";
import ResumeAssistant from "#/components/ResumeAssistant";
import CertificatesSection from "#/components/sections/CertificatesSection";
import EducationSection from "#/components/sections/EducationSection";
import ExperienceSection from "#/components/sections/ExperienceSection";
import HeroSection from "#/components/sections/HeroSection";
import ProjectsSection from "#/components/sections/ProjectsSection";
import TechnologiesSection from "#/components/sections/TechnologiesSection";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<>
			<ResumeAssistant />
			<HeroSection />
			<TechnologiesSection />
			<ExperienceSection />
			<EducationSection />
			<ProjectsSection />
			<CertificatesSection />
		</>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ResumeAssistant from "#/components/ResumeAssistant";
import CertificatesSection from "#/components/sections/CertificatesSection";
import EducationSection from "#/components/sections/EducationSection";
import ExperienceSection from "#/components/sections/ExperienceSection";
import HeroSection from "#/components/sections/HeroSection";
import ProjectsSection from "#/components/sections/ProjectsSection";
import TechnologiesSection from "#/components/sections/TechnologiesSection";
import { DataProvider, type InitialData } from "#/lib/data-context";

const EMPTY: InitialData = {
	projects: [],
	jobs: [],
	education: [],
	certificates: [],
	technologies: [],
};

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const [data, setData] = useState<InitialData>(EMPTY);

	useEffect(() => {
		fetch("/api/public", { method: "POST" })
			.then((r) => r.json())
			.then((json) => {
				if (!json.error) setData(json);
			})
			.catch(() => {});
	}, []);

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

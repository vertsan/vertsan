import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ResumeAssistant from "#/components/ResumeAssistant";
import AboutSection from "#/components/sections/AboutSection";
import EducationSection from "#/components/sections/EducationSection";
import ExperienceSection from "#/components/sections/ExperienceSection";
import GetInTouchSection from "#/components/sections/GetInTouchSection";
import HeroSection from "#/components/sections/HeroSection";
import TechnologiesSection from "#/components/sections/TechnologiesSection";
import WhatICanDoSection from "#/components/sections/WhatICanDoSection";

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
		fetch("/api/public", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}",
		})
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
			<AboutSection />
			<WhatICanDoSection />
			<TechnologiesSection />
			<ExperienceSection />
			<EducationSection />
			<GetInTouchSection />
		</DataProvider>
	);
}

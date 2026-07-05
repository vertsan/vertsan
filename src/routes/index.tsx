import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import ResumeAssistant from "#/components/ResumeAssistant";
import HeroSection from "#/components/sections/HeroSection";

import { DataProvider, type InitialData } from "#/lib/data-context";

const GetInTouchSection = lazy(() => import("#/components/sections/GetInTouchSection"));
const TestimonialsSection = lazy(() => import("#/components/sections/TestimonialsSection"));
const WhatICanDoSection = lazy(() => import("#/components/sections/WhatICanDoSection"));

const SectionFallback = () => <div className="min-h-[50vh] flex items-center justify-center"><div className="size-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" /></div>;

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
			<Suspense fallback={<SectionFallback />}>
				<WhatICanDoSection />
			</Suspense>
			<Suspense fallback={<SectionFallback />}>
				<TestimonialsSection />
			</Suspense>
			<Suspense fallback={<SectionFallback />}>
				<GetInTouchSection />
			</Suspense>
		</DataProvider>
	);
}

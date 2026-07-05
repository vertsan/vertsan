import { createFileRoute } from "@tanstack/react-router";
import AboutSection from "#/components/sections/AboutSection";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return <AboutSection />;
}

import { createFileRoute } from "@tanstack/react-router";
import ExperienceSection from "#/components/sections/ExperienceSection";

export const Route = createFileRoute("/experience")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ExperienceSection />;
}

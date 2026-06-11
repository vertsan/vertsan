import { createFileRoute } from "@tanstack/react-router";
import ProjectsSection from "#/components/sections/ProjectsSection";

export const Route = createFileRoute("/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ProjectsSection />;
}

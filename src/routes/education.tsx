import { createFileRoute } from "@tanstack/react-router";
import EducationSection from "#/components/sections/EducationSection";

export const Route = createFileRoute("/education")({
	component: RouteComponent,
});

function RouteComponent() {
	return <EducationSection />;
}

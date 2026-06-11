import { createFileRoute } from "@tanstack/react-router";
import TechnologiesSection from "#/components/sections/TechnologiesSection";

export const Route = createFileRoute("/technologies")({
	component: RouteComponent,
});

function RouteComponent() {
	return <TechnologiesSection />;
}

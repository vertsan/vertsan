import { createFileRoute } from "@tanstack/react-router";
import ProjectsSection from "#/components/sections/ProjectsSection";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";

export const Route = createFileRoute("/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative overflow-hidden">
			<FlickeringGrid
				className="absolute top-0 left-0 right-0 z-0 h-48"
				squareSize={4}
				gridGap={6}
				color="#60A5FA"
				maxOpacity={0.14}
				flickerChance={0.1}
				width={1400}
				height={200}
			/>
			<div className="relative z-10">
				<ProjectsSection />
			</div>
		</div>
	);
}

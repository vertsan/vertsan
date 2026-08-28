import { createFileRoute } from "@tanstack/react-router";
import NavbarDemo from "#/components/resizable-navbar-demo";

export const Route = createFileRoute("/navbar-demo")({
	component: NavbarDemoRoute,
});

function NavbarDemoRoute() {
	return <NavbarDemo />;
}

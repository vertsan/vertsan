import { createFileRoute } from "@tanstack/react-router";
import CertificatesSection from "#/components/sections/CertificatesSection";

export const Route = createFileRoute("/certificates")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CertificatesSection />;
}

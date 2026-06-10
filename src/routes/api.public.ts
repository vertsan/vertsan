import { createFileRoute } from "@tanstack/react-router";
import { createCertificateService } from "#/services/certificate.service";
import { createEducationService } from "#/services/education.service";
import { createJobService } from "#/services/job.service";
import { createProjectService } from "#/services/project.service";
import { createTechnologyService } from "#/services/technology.service";

export const Route = createFileRoute("/api/public")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const { collection } = body as { collection?: string };

					if (collection) {
						switch (collection) {
							case "jobs": {
								const items = await createJobService().list();
								return Response.json({ items });
							}
							case "education": {
								const items = await createEducationService().list();
								return Response.json({ items });
							}
							case "projects": {
								const items = (await createProjectService().list()).filter(
									(p: { slug?: string }) => p.slug,
								);
								return Response.json({ items });
							}
							case "certificates": {
								const items = await createCertificateService().list();
								return Response.json({ items });
							}
							case "technologies": {
								const items = await createTechnologyService().list();
								return Response.json({ items });
							}
							default:
								return Response.json(
									{ error: "Unknown collection" },
									{ status: 400 },
								);
						}
					}

				const [allJobs, allEducation, allProjects, allCertificates, allTechnologies] =
					await Promise.all([
						createJobService().list(),
						createEducationService().list(),
						createProjectService().list(),
						createCertificateService().list(),
						createTechnologyService().list(),
					]);

				return Response.json({
					jobs: allJobs,
					education: allEducation,
					projects: allProjects.filter(
						(p: { slug?: string }) => p.slug,
					),
					certificates: allCertificates,
					technologies: allTechnologies,
				});
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Public API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

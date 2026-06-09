import { createFileRoute } from "@tanstack/react-router";
import { collectionConfig } from "#/lib/admin/config";
import { createCertificateService } from "#/services/certificate.service";
import { createEducationService } from "#/services/education.service";
import { createJobService } from "#/services/job.service";
import { createProjectService } from "#/services/project.service";
import { createTechnologyService } from "#/services/technology.service";

const validCollections = new Set(Object.keys(collectionConfig));

const services: Record<
	string,
	ReturnType<typeof createJobService>
> = {} as Record<string, ReturnType<typeof createJobService>>;
services.jobs = createJobService() as never;
services.education = createEducationService() as never;
services.projects = createProjectService() as never;
services.certificates = createCertificateService() as never;
services.technologies = createTechnologyService() as never;

export const Route = createFileRoute("/api/admin")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const { collection, action, id, data } = body as {
						collection: string;
						action: string;
						id?: number;
						data?: Record<string, unknown>;
					};

					if (!validCollections.has(collection)) {
						return Response.json(
							{ error: `Unknown collection: ${collection}` },
							{ status: 400 },
						);
					}

					if (action === "config") {
						return Response.json({ config: collectionConfig[collection] });
					}

					const service = services[collection];

					switch (action) {
						case "list": {
							const items = await service.list();
							return Response.json({ items });
						}
						case "get": {
							if (!id)
								return Response.json({ error: "Missing id" }, { status: 400 });
							const item = await service.get(id);
							if (!item)
								return Response.json({ error: "Not found" }, { status: 404 });
							return Response.json({ item });
						}
						case "create": {
							if (!data)
								return Response.json(
									{ error: "Missing data" },
									{ status: 400 },
								);
							const [created] = await service.create(data);
							return Response.json({ item: created });
						}
						case "update": {
							if (!id || !data)
								return Response.json(
									{ error: "Missing id or data" },
									{ status: 400 },
								);
							const [updated] = await service.update(id, data);
							return Response.json({ item: updated });
						}
						case "delete": {
							if (!id)
								return Response.json({ error: "Missing id" }, { status: 400 });
							await service.remove(id);
							return Response.json({ success: true });
						}
						default:
							return Response.json(
								{ error: `Unknown action: ${action}` },
								{ status: 400 },
							);
					}
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Admin API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

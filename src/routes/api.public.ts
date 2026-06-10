import { createFileRoute } from "@tanstack/react-router";
import { createCertificateService } from "#/services/certificate.service";
import { createEducationService } from "#/services/education.service";
import { createJobService } from "#/services/job.service";
import { createProjectService } from "#/services/project.service";
import { createTechnologyService } from "#/services/technology.service";

const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 60_000;

function setCached<T>(key: string, data: T): T {
	cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
	return data;
}

function getCached<T>(key: string): T | null {
	const entry = cache.get(key);
	if (entry && entry.expiry > Date.now()) return entry.data as T;
	cache.delete(key);
	return null;
}

const collections = {
	jobs: createJobService().list,
	education: createEducationService().list,
	projects: async () =>
		(await createProjectService().list()).filter(
			(p: { slug?: string }) => p.slug,
		),
	certificates: createCertificateService().list,
	technologies: createTechnologyService().list,
} as const;

type Collection = keyof typeof collections;

async function fetchSingle(collection: Collection) {
	const cached = getCached<unknown[]>(collection);
	if (cached) return { items: cached };

	const items = await collections[collection]();
	return { items: setCached(collection, items) };
}

async function fetchAll() {
	const cached = getCached<Record<string, unknown[]>>("all");
	if (cached) return cached;

	const [allJobs, allEducation, allProjects, allCertificates, allTechnologies] =
		await Promise.all(
			Object.values(collections).map((fn) => fn()),
		);

	const data = {
		jobs: allJobs,
		education: allEducation,
		projects: allProjects,
		certificates: allCertificates,
		technologies: allTechnologies,
	} as Record<string, unknown[]>;

	return setCached("all", data);
}

export const Route = createFileRoute("/api/public")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const { collection } = body as { collection?: string };

					if (collection) {
						if (!(collection in collections)) {
							return Response.json(
								{ error: "Unknown collection" },
								{ status: 400 },
							);
						}
						return Response.json(
							await fetchSingle(collection as Collection),
						);
					}

					return Response.json(await fetchAll());
				} catch (err: unknown) {
					const message =
						err instanceof Error ? err.message : "Unknown error";
					console.error("Public API error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

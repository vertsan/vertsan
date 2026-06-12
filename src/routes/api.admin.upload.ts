import { createFileRoute } from "@tanstack/react-router";
import { uploadFile } from "#/lib/cloudinary";

export const Route = createFileRoute("/api/admin/upload")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = (await request.json()) as {
						name: string;
						data: string;
						resourceType?: "image" | "raw" | "auto";
					};

					if (!body.data || !body.name) {
						return Response.json(
							{ error: "Missing file data or name" },
							{ status: 400 },
						);
					}

					const url = await uploadFile(body.data, body.resourceType ?? "auto");

					return Response.json({ url });
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Upload error:", err);
					return Response.json({ error: message }, { status: 500 });
				}
			},
		},
	},
});

import { createFileRoute } from "@tanstack/react-router";
import { uploadFile } from "#/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getRawSize(dataUrl: string): number {
	const commaIndex = dataUrl.indexOf(",");
	if (commaIndex === -1) return 0;
	const base64 = dataUrl.slice(commaIndex + 1);
	return Math.round((base64.length * 3) / 4);
}

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

					const rawSize = getRawSize(body.data);
					if (rawSize > MAX_FILE_SIZE) {
						return Response.json(
							{
								error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
							},
							{ status: 413 },
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

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/download")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const targetUrl = url.searchParams.get("url");
				if (!targetUrl) {
					return new Response("Missing url parameter", { status: 400 });
				}

				const parsed = new URL(targetUrl);
				if (!parsed.hostname.endsWith("github.com")) {
					return Response.redirect(targetUrl, 302);
				}

				const token = process.env.GITHUB_TOKEN;
				if (!token) {
					return Response.redirect(targetUrl, 302);
				}

				const assetResponse = await fetch(targetUrl, {
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/octet-stream",
					},
				});

				if (!assetResponse.ok) {
					return new Response("Failed to fetch file", {
						status: assetResponse.status,
					});
				}

				const filename = parsed.pathname.split("/").pop() || "download";
				return new Response(assetResponse.body, {
					headers: {
						"Content-Type": assetResponse.headers.get("content-type") || "application/octet-stream",
						"Content-Length": assetResponse.headers.get("content-length") || "",
						"Content-Disposition": `attachment; filename="${filename}"`,
					},
				});
			},
		},
	},
});

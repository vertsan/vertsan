import { createFileRoute } from "@tanstack/react-router";
import { createVisitorService } from "#/services/visitor.service";

export const Route = createFileRoute("/api/visitor-countries")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const countries = await createVisitorService().countries();
					return Response.json(
						{ countries },
						{
							headers: {
								"Cache-Control":
									"public, s-maxage=30, stale-while-revalidate=300",
							},
						},
					);
				} catch (err: unknown) {
					console.error("Visitor countries API error:", err);
					return Response.json(
						{ error: "Failed to load visitor countries" },
						{ status: 500 },
					);
				}
			},
		},
	},
});

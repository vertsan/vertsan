import { createFileRoute } from "@tanstack/react-router";
import { v2 as cloudinary } from "cloudinary";

export const Route = createFileRoute("/api/admin/upload-signature")({
	server: {
		handlers: {
			GET: async () => {
				const timestamp = Math.round(Date.now() / 1000);
				const params: Record<string, string | number> = {
					timestamp,
					folder: "vertsan",
				};
				const config = cloudinary.config();
				const signature = cloudinary.utils.api_sign_request(
					params,
					config.api_secret!,
				);
				return Response.json({
					signature,
					timestamp,
					api_key: config.api_key!,
					cloud_name: config.cloud_name!,
				});
			},
		},
	},
});

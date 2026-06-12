import { v2 as cloudinary } from "cloudinary";

export async function uploadFile(dataUrl: string, resourceType: "image" | "raw" | "auto" = "auto"): Promise<string> {
	const result = await cloudinary.uploader.upload(dataUrl, {
		folder: "vertsan",
		resourceType,
	});

	return result.secure_url;
}

export async function uploadImage(dataUrl: string): Promise<string> {
	return uploadFile(dataUrl, "image");
}

export async function deleteImage(url: string): Promise<void> {
	const segments = url.split("/");
	const publicIdWithExt = segments.slice(-2).join("/").replace(/\.[^.]+$/, "");
	await cloudinary.uploader.destroy(publicIdWithExt);
}

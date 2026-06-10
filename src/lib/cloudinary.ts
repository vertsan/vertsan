import { v2 as cloudinary } from "cloudinary";

export async function uploadImage(dataUrl: string): Promise<string> {
	const result = await cloudinary.uploader.upload(dataUrl, {
		folder: "vertsan",
		resourceType: "image",
	});

	return result.secure_url;
}

export async function deleteImage(url: string): Promise<void> {
	const segments = url.split("/");
	const publicIdWithExt = segments.slice(-2).join("/").replace(/\.[^.]+$/, "");
	await cloudinary.uploader.destroy(publicIdWithExt);
}

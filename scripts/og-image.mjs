import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const svg = readFileSync(resolve(root, "public/og-image.svg"), "utf-8");

await sharp(Buffer.from(svg))
	.resize(1200, 630)
	.png()
	.toFile(resolve(root, "public/og-image.png"));

console.log("✅ public/og-image.png created");

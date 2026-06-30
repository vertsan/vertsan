declare module "*.glb" {
	const src: string;
	export default src;
}

declare module "*.css?url" {
	const content: string;
	export default content;
}

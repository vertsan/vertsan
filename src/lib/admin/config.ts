export type FieldConfig = {
	name: string;
	label: string;
	type: "text" | "tags" | "markdown" | "date";
	required?: boolean;
};

export type CollectionConfig = {
	dir: string;
	label: string;
	icon: string;
	fields: FieldConfig[];
};

export const collectionConfig: Record<string, CollectionConfig> = {
	jobs: {
		dir: "jobs",
		label: "Jobs",
		icon: "Briefcase",
		fields: [
			{ name: "jobTitle", label: "Job Title", type: "text", required: true },
			{ name: "company", label: "Company", type: "text", required: true },
			{ name: "location", label: "Location", type: "text", required: true },
			{ name: "summary", label: "Summary", type: "text", required: true },
			{ name: "startDate", label: "Start Date", type: "date", required: true },
			{ name: "endDate", label: "End Date", type: "date" },
			{ name: "tags", label: "Tags", type: "tags", required: true },
			{ name: "content", label: "Content", type: "markdown" },
		],
	},
	education: {
		dir: "education",
		label: "Education",
		icon: "GraduationCap",
		fields: [
			{ name: "school", label: "School", type: "text", required: true },
			{ name: "summary", label: "Summary", type: "text", required: true },
			{ name: "startDate", label: "Start Date", type: "date", required: true },
			{ name: "endDate", label: "End Date", type: "date" },
			{ name: "tags", label: "Tags", type: "tags", required: true },
			{ name: "content", label: "Content", type: "markdown" },
		],
	},
	projects: {
		dir: "projects",
		label: "Projects",
		icon: "FolderKanban",
		fields: [
			{ name: "title", label: "Title", type: "text", required: true },
			{ name: "slug", label: "Slug", type: "text", required: true },
			{ name: "summary", label: "Summary", type: "text", required: true },
			{ name: "status", label: "Status", type: "text", required: true },
			{ name: "startDate", label: "Start Date", type: "date", required: true },
			{ name: "endDate", label: "End Date", type: "date", required: true },
			{ name: "image", label: "Image", type: "text" },
			{ name: "link", label: "Link", type: "text" },
			{ name: "github", label: "GitHub", type: "text" },
			{ name: "tags", label: "Tags", type: "tags", required: true },
			{ name: "content", label: "Content", type: "markdown" },
		],
	},
	certificates: {
		dir: "certificates",
		label: "Certificates",
		icon: "Award",
		fields: [
			{ name: "title", label: "Title", type: "text", required: true },
			{ name: "issuer", label: "Issuer", type: "text", required: true },
			{ name: "date", label: "Date", type: "date", required: true },
			{ name: "summary", label: "Summary", type: "text", required: true },
			{ name: "credentialUrl", label: "Credential URL", type: "text" },
			{ name: "tags", label: "Tags", type: "tags", required: true },
			{ name: "content", label: "Content", type: "markdown" },
		],
	},
	technologies: {
		dir: "technologies",
		label: "Technologies",
		icon: "Cpu",
		fields: [
			{ name: "category", label: "Category", type: "text", required: true },
			{ name: "items", label: "Items", type: "tags", required: true },
			{ name: "content", label: "Content", type: "markdown" },
		],
	},
};

export type CollectionKey = keyof typeof collectionConfig;

import {
	createProjectRepository,
	type NewProject,
} from "#/repositories/project.repository";

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "")
		|| "untitled";
}

export function createProjectService() {
	const repo = createProjectRepository();

	function list() {
		return repo.findAll();
	}

	function get(id: number) {
		return repo.findById(id);
	}

	function create(data: Record<string, unknown>) {
		const rawSlug = String(data.slug ?? "").trim();
		const input: NewProject = {
			title: String(data.title ?? ""),
			slug: rawSlug || slugify(String(data.title ?? "")),
			summary: String(data.summary ?? ""),
			status: String(data.status ?? ""),
			startDate: String(data.startDate ?? ""),
			endDate: String(data.endDate ?? ""),
			image: data.image ? String(data.image) : null,
			link: data.link ? String(data.link) : null,
			github: data.github ? String(data.github) : null,
			tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
			content: String(data.content ?? ""),
		};
		return repo.create(input);
	}

	function update(id: number, data: Partial<Record<string, unknown>>) {
		const input: Partial<NewProject> = { updatedAt: new Date() };
		if (data.title !== undefined) input.title = String(data.title);
		if (data.slug !== undefined) input.slug = String(data.slug).trim() || undefined;
		if (data.summary !== undefined) input.summary = String(data.summary);
		if (data.status !== undefined) input.status = String(data.status);
		if (data.startDate !== undefined) input.startDate = String(data.startDate);
		if (data.endDate !== undefined) input.endDate = String(data.endDate);
		if (data.image !== undefined)
			input.image = data.image ? String(data.image) : null;
		if (data.link !== undefined)
			input.link = data.link ? String(data.link) : null;
		if (data.github !== undefined)
			input.github = data.github ? String(data.github) : null;
		if (data.tags !== undefined)
			input.tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
		if (data.content !== undefined) input.content = String(data.content);
		return repo.update(id, input);
	}

	function remove(id: number) {
		return repo.remove(id);
	}

	return { list, get, create, update, remove };
}

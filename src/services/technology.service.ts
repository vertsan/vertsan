import {
	createTechnologyRepository,
	type NewTechnology,
} from "#/repositories/technology.repository";

export function createTechnologyService() {
	const repo = createTechnologyRepository();

	function list() {
		return repo.findAll();
	}

	function get(id: number) {
		return repo.findById(id);
	}

	function create(data: Record<string, unknown>) {
		const input: NewTechnology = {
			category: String(data.category ?? ""),
			items: Array.isArray(data.items) ? data.items.map(String) : [],
			content: String(data.content ?? ""),
		};
		return repo.create(input);
	}

	function update(id: number, data: Partial<Record<string, unknown>>) {
		const input: Partial<NewTechnology> = { updatedAt: new Date() };
		if (data.category !== undefined) input.category = String(data.category);
		if (data.items !== undefined)
			input.items = Array.isArray(data.items) ? data.items.map(String) : [];
		if (data.content !== undefined) input.content = String(data.content);
		return repo.update(id, input);
	}

	function remove(id: number) {
		return repo.remove(id);
	}

	return { list, get, create, update, remove };
}

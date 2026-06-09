import {
	createJobRepository,
	type NewJob,
} from "#/repositories/job.repository";

export function createJobService() {
	const repo = createJobRepository();

	function list() {
		return repo.findAll();
	}

	function get(id: number) {
		return repo.findById(id);
	}

	function create(data: Record<string, unknown>) {
		const input: NewJob = {
			jobTitle: String(data.jobTitle ?? ""),
			company: String(data.company ?? ""),
			location: String(data.location ?? ""),
			summary: String(data.summary ?? ""),
			startDate: String(data.startDate ?? ""),
			endDate: data.endDate ? String(data.endDate) : null,
			tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
			content: String(data.content ?? ""),
		};
		return repo.create(input);
	}

	function update(id: number, data: Partial<Record<string, unknown>>) {
		const input: Partial<NewJob> = { updatedAt: new Date() };
		if (data.jobTitle !== undefined) input.jobTitle = String(data.jobTitle);
		if (data.company !== undefined) input.company = String(data.company);
		if (data.location !== undefined) input.location = String(data.location);
		if (data.summary !== undefined) input.summary = String(data.summary);
		if (data.startDate !== undefined) input.startDate = String(data.startDate);
		if (data.endDate !== undefined)
			input.endDate = data.endDate ? String(data.endDate) : null;
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

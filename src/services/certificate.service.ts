import {
	createCertificateRepository,
	type NewCertificate,
} from "#/repositories/certificate.repository";

export function createCertificateService() {
	const repo = createCertificateRepository();

	function list() {
		return repo.findAll();
	}

	function get(id: number) {
		return repo.findById(id);
	}

	function create(data: Record<string, unknown>) {
		const input: NewCertificate = {
			title: String(data.title ?? ""),
			issuer: String(data.issuer ?? ""),
			date: String(data.date ?? ""),
			summary: String(data.summary ?? ""),
			credentialUrl: data.credentialUrl ? String(data.credentialUrl) : null,
			tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
			content: String(data.content ?? ""),
		};
		return repo.create(input);
	}

	function update(id: number, data: Partial<Record<string, unknown>>) {
		const input: Partial<NewCertificate> = { updatedAt: new Date() };
		if (data.title !== undefined) input.title = String(data.title);
		if (data.issuer !== undefined) input.issuer = String(data.issuer);
		if (data.date !== undefined) input.date = String(data.date);
		if (data.summary !== undefined) input.summary = String(data.summary);
		if (data.credentialUrl !== undefined)
			input.credentialUrl = data.credentialUrl
				? String(data.credentialUrl)
				: null;
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

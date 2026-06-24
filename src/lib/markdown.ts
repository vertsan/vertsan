import { marked, type Tokens } from "marked";

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

marked.use({
	gfm: true,
	breaks: true,
	renderer: {
		code({ text, lang }: Tokens.Code) {
			const langClass = lang
				? ` class="language-${lang.replace(/[^a-zA-Z0-9_+#-]/g, "")}"`
				: "";
			const escaped = escapeHtml(text);
			return [
				`<div class="relative group my-6">`,
				`<pre class="bg-muted rounded-lg p-4 overflow-x-auto text-sm leading-relaxed border border-border border-l-4 border-l-primary/15">`,
				`<code${langClass}>${escaped}</code>`,
				`</pre>`,
				`</div>`,
			].join("\n");
		},

		codespan({ text }: Tokens.Codespan) {
			return `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">${escapeHtml(text)}</code>`;
		},

		heading({ tokens, depth }: Tokens.Heading) {
			const text = this.parser.parseInline(tokens);
			const classes: Record<number, string> = {
				1: "text-3xl font-bold mt-12 mb-4 tracking-tight",
				2: "text-2xl font-bold mt-10 mb-3 tracking-tight",
				3: "text-xl font-semibold mt-8 mb-2",
				4: "text-lg font-semibold mt-6 mb-2",
				5: "text-base font-medium mt-6 mb-1",
				6: "text-sm font-medium mt-6 mb-1",
			};
			return `<h${depth} class="${classes[depth] ?? classes[2]}">${text}</h${depth}>`;
		},

		paragraph({ tokens }: Tokens.Paragraph) {
			const text = this.parser.parseInline(tokens);
			return `<p class="mb-5 leading-relaxed">${text}</p>`;
		},

		list(token: Tokens.List) {
			const tag = token.ordered ? "ol" : "ul";
			const cls = token.ordered
				? "list-decimal ml-6 mb-6 space-y-1.5"
				: "list-disc ml-6 mb-6 space-y-1.5";
			const startAttr =
				token.ordered && token.start !== 1
					? ` start="${token.start}"`
					: "";
			const items = token.items
				.map((item) => this.listitem(item))
				.join("\n");
			return `<${tag} class="${cls}"${startAttr}>\n${items}\n</${tag}>`;
		},

		listitem(item: Tokens.ListItem) {
			const text = this.parser.parse(item.tokens);
			if (item.task) {
				return `<li class="flex items-start gap-2 leading-relaxed"><input type="checkbox" class="mt-1 shrink-0" ${item.checked ? "checked" : ""} disabled /> <span>${text}</span></li>`;
			}
			return `<li class="leading-relaxed">${text}</li>`;
		},

		blockquote({ tokens }: Tokens.Blockquote) {
			const text = this.parser.parse(tokens);
			return `<blockquote class="border-l-4 border-primary/30 pl-6 my-6 italic text-muted-foreground">${text}</blockquote>`;
		},

		table(token: Tokens.Table) {
			const alignAttr = (align?: string) =>
				align ? ` style="text-align: ${align}"` : "";
			const thead =
				`<thead class="bg-muted/60">\n<tr>\n` +
				token.header
					.map(
						(cell) =>
							`<th class="p-3 font-semibold text-left border border-border${cell.align ? ` text-${cell.align}` : ""}"${alignAttr(cell.align)}>${this.parser.parseInline(cell.tokens)}</th>`,
					)
					.join("\n") +
				`\n</tr>\n</thead>`;
			const tbody =
				`<tbody>\n` +
				token.rows
					.map(
						(row, ri) =>
							`<tr class="${ri % 2 === 1 ? "bg-muted/20" : ""} transition-colors hover:bg-muted/40">\n` +
							row
								.map(
									(cell) =>
										`<td class="p-3 border border-border${cell.align ? ` text-${cell.align}` : ""}"${alignAttr(cell.align)}>${this.parser.parseInline(cell.tokens)}</td>`,
								)
								.join("\n") +
							`\n</tr>`,
					)
					.join("\n") +
				`\n</tbody>`;
			return [
				`<div class="not-prose overflow-x-auto my-6 rounded-lg border border-border">`,
				`<table class="w-full border-collapse text-sm">`,
				thead,
				tbody,
				`</table>`,
				`</div>`,
			].join("\n");
		},

		image({ href, title, text }: Tokens.Image) {
			const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
			return [
				`<figure class="my-8">`,
				`<img src="${href}" alt="${escapeHtml(text)}"${titleAttr} class="w-full rounded-lg border border-border" loading="lazy" />`,
				text
					? `<figcaption class="text-sm text-muted-foreground mt-2 text-center">${escapeHtml(text)}</figcaption>`
					: "",
				`</figure>`,
			].join("\n");
		},

		link({ href, tokens }: Tokens.Link) {
			const text = this.parser.parseInline(tokens);
			const isExternal = href?.startsWith("http");
			const target = isExternal
				? ' target="_blank" rel="noreferrer"'
				: "";
			const icon = isExternal
				? `<svg class="inline-block size-3.5 ml-0.5 -mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`
				: "";
			return `<a href="${href}"${target} class="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all">${text}${icon}</a>`;
		},

		hr() {
			return `<hr class="my-10 border-border" />`;
		},
	},
});

export function renderMarkdown(content: string): string {
	return content?.trim() ? (marked(content) as string) : "";
}

import {
	AlertTriangle,
	Award,
	Briefcase,
	Check,
	Cpu,
	FileIcon,
	FolderKanban,
	GraduationCap,
	ImageIcon,
	Loader2,
	Pencil,
	Plus,
	Save,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import type {
	CollectionConfig,
	CollectionKey,
	FieldConfig,
} from "#/lib/admin/config";
import TagInput from "./TagInput";
import { useAuth } from "#/lib/admin/auth-context";
import { clearCache } from "#/lib/useLiveContent";

interface Props {
	collection: CollectionKey;
	title?: string;
}

type RecordData = Record<string, unknown> & { id?: number };

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
	Briefcase,
	GraduationCap,
	FolderKanban,
	Award,
	Cpu,
};

export default function CollectionManager({ collection, title }: Props) {
	const { isAdmin } = useAuth();
	const [config, setConfig] = useState<CollectionConfig | null>(null);
	const [items, setItems] = useState<RecordData[]>([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState<RecordData | null>(null);
	const [isNew, setIsNew] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [markdownPreview, setMarkdownPreview] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<RecordData | null>(null);
	const [uploadingFile, setUploadingFile] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement>(null);

	const api = useCallback(
		(action: string, extra: Record<string, unknown> = {}) =>
			fetch("/api/admin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ collection, action, ...extra }),
			}).then((r) => r.json()),
		[collection],
	);

	const loadConfigAndItems = useCallback(async () => {
		setLoading(true);
		try {
			const [cfg, data] = await Promise.all([api("config"), api("list")]);
			setConfig(cfg.config || null);
			setItems(data.items || []);
		} catch {
			setError("Failed to load data");
		} finally {
			setLoading(false);
		}
	}, [api]);

	useEffect(() => {
		loadConfigAndItems();
	}, [loadConfigAndItems]);

	useEffect(() => {
		if (success) {
			const t = setTimeout(() => setSuccess(""), 3000);
			return () => clearTimeout(t);
		}
	}, [success]);

	function emptyRecord(): RecordData {
		if (!config) return { content: "" };
		const record: Record<string, unknown> = { content: "" };
		for (const field of config.fields) {
			if (field.type === "tags") {
				record[field.name] = [];
			} else {
				record[field.name] = "";
			}
		}
		return record;
	}

	function handleNew() {
		if (!isAdmin) return;
		setEditing(emptyRecord());
		setIsNew(true);
		setError("");
		setMarkdownPreview(null);
		setSuccess("");
	}

	function handleEdit(item: RecordData) {
		if (!isAdmin) return;
		setEditing({ ...item });
		setIsNew(false);
		setError("");
		setMarkdownPreview(null);
		setSuccess("");
	}

	function handleCancel() {
		setEditing(null);
		setIsNew(false);
		setError("");
		setMarkdownPreview(null);
		setSuccess("");
	}

	function slugify(text: string) {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
	}

	function handleFieldChange(name: string, value: unknown) {
		if (!editing) return;
		const next = { ...editing, [name]: value };
		if (name === "title" && isNew) {
			next.slug = slugify(String(value));
		}
		setEditing(next);
	}

	async function handleSave() {
		if (!editing) return;
		setSaving(true);
		setError("");

		try {
			const { id: _, ...data } = editing;

			if (isNew) {
				const res = await api("create", { data });
				if (res.error) throw new Error(res.error);
			} else {
				const res = await api("update", { id: editing.id, data });
				if (res.error) throw new Error(res.error);
			}

			setEditing(null);
			setIsNew(false);
			clearCache(collection);
			setSuccess(`${config?.label.slice(0, -1) ?? "Item"} saved successfully`);
			await loadConfigAndItems();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(item: RecordData) {
		if (!config) return;
		try {
			const res = await api("delete", { id: item.id });
			if (res.error) throw new Error(res.error);
			setSuccess(`${config.label.slice(0, -1)} deleted successfully`);
			clearCache(collection);
			setConfirmDelete(null);
			await loadConfigAndItems();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Delete failed");
		}
	}

	function getDisplayName(item: RecordData): string {
		return String(
			item.title ||
				item.jobTitle ||
				item.school ||
				item.category ||
				item.id ||
				"",
		);
	}

	function getDateValue(item: RecordData): string | null {
		return (item.startDate as string) || (item.date as string) || null;
	}

	function isImageField(fieldName: string) {
		return fieldName === "image";
	}

	const MAX_FILE_SIZE = 100 * 1024 * 1024;

	const CLOUDINARY_MAX_SIZE = 10 * 1024 * 1024;

	async function handleFileUpload(fieldName: string, file: File | null) {
		if (!file) {
			handleFieldChange(fieldName, "");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			setError(
				`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
			);
			return;
		}

		if (file.size > CLOUDINARY_MAX_SIZE) {
			setError(
				`File exceeds Cloudinary's ${CLOUDINARY_MAX_SIZE / 1024 / 1024}MB free plan limit. ` +
					"Upload to a hosting service (e.g. GitHub Releases) and paste the URL below.",
			);
			return;
		}

		setUploadingFile(fieldName);

		try {
			if (isImageField(fieldName)) {
				const reader = new FileReader();
				const dataUrl = await new Promise<string>((resolve, reject) => {
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = () => reject(new Error("Failed to read file"));
					reader.readAsDataURL(file);
				});

				const res = await fetch("/api/admin/upload", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: file.name,
						data: dataUrl,
						resourceType: "image",
					}),
				});

				const result = await res.json();
				if (result.error) throw new Error(result.error);
				handleFieldChange(fieldName, result.url);
			} else {
				const sigRes = await fetch("/api/admin/upload-signature");
				const { signature, timestamp, api_key, cloud_name } =
					await sigRes.json();

				const formData = new FormData();
				formData.append("file", file);
				formData.append("timestamp", String(timestamp));
				formData.append("folder", "vertsan");
				formData.append("api_key", api_key);
				formData.append("signature", signature);

				const uploadRes = await fetch(
					`https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
					{ method: "POST", body: formData },
				);

				const uploadResult = await uploadRes.json();
				if (uploadResult.error) throw new Error(uploadResult.error.message);
				handleFieldChange(fieldName, uploadResult.secure_url);
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploadingFile(null);
		}
	}

	useEffect(() => {
		if (!editing) {
			setMarkdownPreview(null);
			return;
		}
		const content = String(editing.content ?? "");
		if (!content.trim()) {
			setMarkdownPreview(null);
			return;
		}
		let cancelled = false;
		(async () => {
			const { marked } = await import("marked");
			const html = await marked(content);
			if (!cancelled) setMarkdownPreview(html);
		})();
		return () => {
			cancelled = true;
		};
	}, [editing?.content, editing]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!config) {
		return (
			<div className="text-center py-20 text-muted-foreground">
				Failed to load configuration
			</div>
		);
	}

	const Icon = icons[config.icon];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					{Icon && (
						<div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
							<Icon className="size-5 text-primary" />
						</div>
					)}
					<div>
						<h1 className="text-xl sm:text-2xl font-bold tracking-tight">
							{title || config.label}
						</h1>
						<p className="text-sm text-muted-foreground">
							{items.length} {config.label.toLowerCase()}
						</p>
					</div>
				</div>
				{!editing && isAdmin && (
					<Button onClick={handleNew} className="gap-2 shadow-sm w-full sm:w-auto">
						<Plus className="size-4" />
						Add {config.label.slice(0, -1)}
					</Button>
				)}
			</div>

			{/* Success toast */}
			{success && (
				<div className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-3 flex items-center gap-2 border border-emerald-500/20">
					<Check className="size-4 shrink-0" />
					{success}
				</div>
			)}

			{/* Error toast */}
			{error && (
				<div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3 flex items-center gap-2">
					<AlertTriangle className="size-4 shrink-0" />
					{error}
				</div>
			)}

			{/* Delete confirmation modal */}
			{confirmDelete && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
					<div className="rounded-xl border bg-card p-6 shadow-lg max-w-sm w-full mx-4 space-y-4">
						<h3 className="font-semibold text-lg">Confirm Delete</h3>
						<p className="text-sm text-muted-foreground">
							Delete{" "}
							<span className="font-medium text-foreground">
								{getDisplayName(confirmDelete)}
							</span>
							? This action cannot be undone.
						</p>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setConfirmDelete(null)}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								size="sm"
								className="gap-2"
								onClick={() => handleDelete(confirmDelete)}
							>
								<Trash2 className="size-4" />
								Delete
							</Button>
						</div>
					</div>
				</div>
			)}

			{editing ? (
				/* Form panel */
				<div
					ref={formRef}
					className="rounded-xl border bg-card shadow-sm overflow-hidden"
				>
					<div className="flex items-center justify-between p-4 border-b bg-muted/20">
						<h2 className="font-semibold flex items-center gap-2">
							{Icon && <Icon className="size-4 text-primary" />}
							{isNew
								? `New ${config.label.slice(0, -1)}`
								: `Edit: ${getDisplayName(editing)}`}
						</h2>
						<div className="flex gap-2">
							{isAdmin ? (
								<>
									<Button
										variant="ghost"
										size="sm"
										className="gap-2"
										onClick={handleCancel}
									>
										<X className="size-4" />
										Cancel
									</Button>
									<Button
										size="sm"
										className="gap-2 shadow-sm"
										onClick={handleSave}
										disabled={saving}
									>
										{saving ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Save className="size-4" />
										)}
										Save
									</Button>
								</>
							) : (
								<Button
									variant="ghost"
									size="sm"
									className="gap-2"
									onClick={handleCancel}
								>
									<X className="size-4" />
									Close
								</Button>
							)}
						</div>
					</div>

					<div className="p-6 space-y-5">
						{config.fields.map((field: FieldConfig) => (
							<div key={field.name}>
								<label className="block text-sm font-medium mb-1.5 text-foreground/80">
									{field.label}
									{field.required && (
										<span className="text-destructive ml-0.5">*</span>
									)}
								</label>

								{field.type === "markdown" ? (
									<div className="space-y-2">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg overflow-hidden">
											<textarea
												value={String(editing[field.name] ?? "")}
												onChange={(e) =>
													handleFieldChange(field.name, e.target.value)
												}
												className="min-h-50 md:min-h-75 p-3 text-sm font-mono bg-background border-0 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
												placeholder={`${field.label} (markdown)...`}
											/>
											<div
												className="min-h-50 md:min-h-75 p-3 text-sm prose prose-sm dark:prose-invert max-w-none overflow-y-auto bg-muted/30 border-t md:border-t-0 md:border-l border-border"
												dangerouslySetInnerHTML={{
													__html: markdownPreview ?? "",
												}}
											/>
										</div>
									</div>
								) : field.type === "tags" ? (
									<TagInput
										value={
											Array.isArray(editing[field.name])
												? (editing[field.name] as string[])
												: []
										}
										onChange={(v) => handleFieldChange(field.name, v)}
										placeholder={`Add ${field.label.toLowerCase()}...`}
									/>
								) : field.type === "file" ? (
									<div className="space-y-3">
										{editing[field.name] ? (
											<div className="relative group rounded-lg overflow-hidden border border-border">
												{isImageField(field.name) ? (
													<img
														src={String(editing[field.name])}
														alt={field.label}
														className="w-full max-h-48 object-cover"
														loading="lazy"
														decoding="async"
													/>
												) : (
													<div className="flex items-center gap-3 p-4 bg-muted/20">
														<FileIcon className="size-8 shrink-0 text-muted-foreground" />
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium truncate">
																{field.label}
															</p>
															<a
																href={String(editing[field.name])}
																target="_blank"
																rel="noreferrer"
																className="text-xs text-primary hover:underline truncate block"
															>
																{String(editing[field.name])}
															</a>
														</div>
													</div>
												)}
												<button
													type="button"
													onClick={() => handleFieldChange(field.name, "")}
													className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
													aria-label="Remove file"
												>
													<X className="size-4" />
												</button>
											</div>
										) : (
											<div className="space-y-3">
												<div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
													{isImageField(field.name) ? (
														<ImageIcon className="size-8 mx-auto text-muted-foreground/40 mb-2" />
													) : (
														<FileIcon className="size-8 mx-auto text-muted-foreground/40 mb-2" />
													)}
													<p className="text-sm text-muted-foreground mb-3">
														{isImageField(field.name)
															? "Upload an image"
															: `Upload ${field.label.toLowerCase()}`}
													</p>
													<label className="inline-flex cursor-pointer gap-2 items-center">
														<input
															type="file"
															accept={
																isImageField(field.name)
																	? "image/*"
																	: ".apk,.ipa,.zip,.aab,.dmg,.app,.mobileprovision,.plist"
															}
															className="hidden"
															onChange={(e) =>
																handleFileUpload(
																	field.name,
																	e.target.files?.[0] ?? null,
																)
															}
															disabled={uploadingFile === field.name}
														/>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="gap-2 pointer-events-none"
															disabled={uploadingFile === field.name}
															asChild
														>
															<span>
																{uploadingFile === field.name ? (
																	<Loader2 className="size-4 animate-spin" />
																) : (
																	<Upload className="size-4" />
																)}
																{uploadingFile === field.name
																	? "Uploading..."
																	: "Choose File"}
															</span>
														</Button>
													</label>
												</div>
												{!isImageField(field.name) && (
													<div className="relative">
														<div className="absolute inset-0 flex items-center">
															<span className="w-full border-t border-border" />
														</div>
														<div className="relative flex justify-center text-xs uppercase">
															<span className="bg-card px-2 text-muted-foreground">
																or paste URL
															</span>
														</div>
													</div>
												)}
												{!isImageField(field.name) && (
													<input
														type="url"
														placeholder="https://github.com/.../app-release.apk"
														value={String(editing[field.name] ?? "")}
														onChange={(e) =>
															handleFieldChange(field.name, e.target.value)
														}
														className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
													/>
												)}
											</div>
										)}
									</div>
								) : field.type === "date" ? (
									<input
										type="date"
										value={String(editing[field.name] ?? "")}
										onChange={(e) =>
											handleFieldChange(field.name, e.target.value)
										}
										className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors [color-scheme:var(--color-scheme)]"
									/>
								) : (
									<textarea
										value={String(editing[field.name] ?? "")}
										onChange={(e) =>
											handleFieldChange(field.name, e.target.value)
										}
										className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
										placeholder={field.label}
										rows={field.name === "summary" ? 2 : 1}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			) : (
				/* Item list */
				<div className="rounded-xl border bg-card shadow-sm overflow-hidden">
					{items.length === 0 ? (
						<div className="text-center py-16 text-muted-foreground">
							{Icon && (
								<div className="mx-auto mb-4 size-12 rounded-full bg-muted flex items-center justify-center">
									<Icon className="size-6 text-muted-foreground/60" />
								</div>
							)}
							<p className="font-medium">No {config.label.toLowerCase()} yet</p>
							<p className="text-sm mt-1">
								{isAdmin
									? `Create your first ${config.label.slice(0, -1).toLowerCase()} to get started`
									: `No ${config.label.toLowerCase()} available yet`}
							</p>
							{isAdmin && (
								<Button variant="link" onClick={handleNew} className="mt-3">
									Add {config.label.slice(0, -1).toLowerCase()}
								</Button>
							)}
						</div>
					) : (
						<div className="divide-y">
							{items.map((item) => {
								const dateVal = getDateValue(item);
								return (
									<div
										key={item.id as number}
										className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors group"
									>
										<div className="flex-1 min-w-0 flex items-center gap-3">
											{Icon && (
												<div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
													<Icon className="size-4 text-primary/60" />
												</div>
											)}
											<div>
												<p className="font-medium truncate text-sm">
													{getDisplayName(item)}
												</p>
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<span>ID: {item.id as number}</span>
													{dateVal && (
														<>
															<span>&middot;</span>
															<span>{dateVal}</span>
														</>
													)}
												</div>
											</div>
										</div>
										{isAdmin ? (
											<div className="flex gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
												<Button
													variant="ghost"
													size="sm"
													className="size-8 p-0"
													onClick={() => handleEdit(item)}
													title="Edit"
												>
													<Pencil className="size-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="size-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
													onClick={() => setConfirmDelete(item)}
													title="Delete"
												>
													<Trash2 className="size-4" />
												</Button>
											</div>
										) : (
											<div className="opacity-70 group-hover:opacity-100 transition-opacity">
												<span className="text-[10px] text-muted-foreground/50 px-2 py-1 rounded-md bg-muted/30">Read only</span>
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

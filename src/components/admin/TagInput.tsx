import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";

interface Props {
	value: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
}

export default function TagInput({ value, onChange, placeholder }: Props) {
	const [input, setInput] = useState("");

	const tags = Array.isArray(value) ? value : [];

	function addTag(tag: string) {
		const trimmed = tag.trim();
		if (trimmed && !tags.includes(trimmed)) {
			onChange([...tags, trimmed]);
		}
		setInput("");
	}

	function removeTag(tag: string) {
		onChange(tags.filter((t) => t !== tag));
	}

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-1.5">
				{tags.map((tag) => (
					<Badge key={tag} variant="secondary" className="gap-1 pr-1">
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="hover:text-destructive transition-colors"
						>
							<X className="size-3" />
						</button>
					</Badge>
				))}
			</div>
			<div className="flex gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addTag(input);
						}
					}}
					placeholder={placeholder || "Add tag and press Enter..."}
					className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => addTag(input)}
					disabled={!input.trim()}
				>
					Add
				</Button>
			</div>
		</div>
	);
}

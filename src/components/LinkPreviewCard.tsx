import { ExternalLink } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";

function getDomain(url: string): string {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return url;
	}
}

function getPath(url: string): string {
	try {
		const p = new URL(url).pathname;
		return p === "/" ? "" : p;
	} catch {
		return "";
	}
}

interface LinkPreviewCardProps {
	href: string;
	variant?: "card" | "pill";
	index?: number;
	className?: string;
}

export function LinkPreviewCard({
	href,
	variant = "card",
	index = 0,
	className,
}: LinkPreviewCardProps) {
	const domain = getDomain(href);
	const path = getPath(href);
	const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
	const delay = `${index * 0.06}s`;

	if (variant === "pill") {
		return (
			<Button
				variant="outline"
				size="sm"
				asChild
				className={cn(
					"rounded-full animate-fade-in opacity-0",
					className,
				)}
				style={{ animationDelay: delay, animationFillMode: "forwards" }}
			>
				<a href={href} target="_blank" rel="noreferrer">
					<img
						src={favicon}
						alt=""
						className="size-3.5 rounded-sm"
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = "none";
						}}
					/>
					<span className="truncate max-w-[140px]">{domain}</span>
					<ExternalLink className="size-3 shrink-0" />
				</a>
			</Button>
		);
	}

	return (
		<Button
			variant="outline"
			asChild
			className={cn(
				"flex items-center gap-4 p-0 h-auto w-full rounded-xl animate-fade-in-up opacity-0",
				className,
			)}
			style={{ animationDelay: delay, animationFillMode: "forwards" }}
		>
			<a href={href} target="_blank" rel="noreferrer" className="p-4 w-full">
				<div className="size-11 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-border">
					<img
						src={favicon}
						alt=""
						className="size-6"
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = "none";
						}}
					/>
				</div>

				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium truncate">{domain}</p>
					{path && (
						<p className="text-xs text-muted-foreground truncate mt-0.5">{path}</p>
					)}
				</div>

				<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
					<span className="hidden sm:inline">Visit</span>
					<ExternalLink className="size-3.5" />
				</div>
			</a>
		</Button>
	);
}

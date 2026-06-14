import { ExternalLink } from "lucide-react";
import { cn } from "#/lib/utils";

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
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className={cn(
					"inline-flex items-center gap-1.5 rounded-full border border-border bg-card",
					"px-3 py-1 text-xs text-muted-foreground",
					"hover:border-primary/40 hover:text-foreground hover:shadow-sm hover:-translate-y-0.5",
					"transition-all duration-300 ease-out",
					"animate-fade-in opacity-0",
					className,
				)}
				style={{ animationDelay: delay, animationFillMode: "forwards" }}
			>
				<img
					src={favicon}
					alt=""
					className="size-3.5 rounded-sm"
					onError={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = "none";
					}}
				/>
				<span className="truncate max-w-[140px]">{domain}</span>
				<ExternalLink className="size-3 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
			</a>
		);
	}

	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className={cn(
				"group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4",
				"hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
				"transition-all duration-300 ease-out",
				"animate-fade-in-up opacity-0",
				"before:pointer-events-none before:absolute before:-inset-[1px] before:rounded-xl before:opacity-0",
				"before:bg-gradient-to-br before:from-primary/20 before:to-transparent",
				"before:transition-opacity before:duration-300",
				"hover:before:opacity-100",
				className,
			)}
			style={{ animationDelay: delay, animationFillMode: "forwards" }}
		>
			<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

			<div className="relative size-11 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-border group-hover:ring-primary/30 group-hover:bg-primary/5 transition-all duration-300">
				<img
					src={favicon}
					alt=""
					className="size-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
					onError={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = "none";
					}}
				/>
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate group-hover:text-foreground transition-colors duration-300">
					{domain}
				</p>
				{path && (
					<p className="text-xs text-muted-foreground truncate mt-0.5 group-hover:text-foreground/70 transition-colors duration-300">
						{path}
					</p>
				)}
			</div>

			<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
				<span className="hidden sm:inline transition-all duration-300 group-hover:text-foreground group-hover:-translate-x-0.5">
					Visit
				</span>
				<ExternalLink className="size-3.5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
			</div>
		</a>
	);
}

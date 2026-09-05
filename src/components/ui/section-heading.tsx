import { cn } from "#/lib/utils";

interface SectionHeadingProps {
	eyebrow?: string;
	title: React.ReactNode;
	titleClassName?: string;
	description?: React.ReactNode;
	className?: string;
}

export default function SectionHeading({
	eyebrow,
	title,
	titleClassName,
	description,
	className,
}: SectionHeadingProps) {
	return (
		<div className={cn("section-heading", className)}>
			{eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
			<h2
				className={cn(
					"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
					titleClassName,
				)}
			>
				{title}
			</h2>
			{description && (
				<p className="max-w-2xl text-sm sm:text-base text-muted-foreground md:text-lg">
					{description}
				</p>
			)}
		</div>
	);
}

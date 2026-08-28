import { motion } from "framer-motion";
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
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className={cn("section-heading", className)}
		>
			{eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
			<h2
				className={cn(
					"text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl",
					titleClassName,
				)}
			>
				{title}
			</h2>
			{description && (
				<p className="max-w-2xl text-base text-muted-foreground md:text-lg">
					{description}
				</p>
			)}
		</motion.div>
	);
}

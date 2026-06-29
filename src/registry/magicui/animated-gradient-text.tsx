import { cn } from "#/lib/utils";
import type { ReactNode } from "react";

export function AnimatedGradientText({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] bg-clip-text text-transparent",
				className,
			)}
		>
			{children}
		</span>
	);
}

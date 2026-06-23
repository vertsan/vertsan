import type * as React from "react";

import { cn } from "#/lib/utils";

function Terminal({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="terminal"
			className={cn(
				"relative w-full rounded-xl border border-border bg-card p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-sm",
				className,
			)}
			{...props}
		>
			<div className="mb-3 flex items-center gap-1.5">
				<span className="size-2.5 rounded-full bg-red-500" />
				<span className="size-2.5 rounded-full bg-yellow-500" />
				<span className="size-2.5 rounded-full bg-green-500" />
			</div>
			<div className="space-y-1.5">{children}</div>
		</div>
	);
}

function TypingAnimation({
	className,
	children,
	delay,
	...props
}: React.ComponentProps<"div"> & { delay?: string }) {
	const text = typeof children === "string" ? children : "";

	return (
		<div
			data-slot="typing-animation"
			className={cn("text-muted-foreground typing-animation", className)}
			style={
				{
					"--text-length": text.length,
					"--delay": delay ?? "0ms",
				} as React.CSSProperties
			}
			{...props}
		>
			{text}
			<span className="inline-block size-[0.6em] bg-current ml-0.5 animate-pulse align-middle" />
		</div>
	);
}

function AnimatedSpan({
	className,
	children,
	delay,
	...props
}: React.ComponentProps<"div"> & { delay?: string }) {
	return (
		<div
			data-slot="animated-span"
			className={cn("text-muted-foreground animated-line", className)}
			style={{ "--delay": delay ?? "0ms" } as React.CSSProperties}
			{...props}
		>
			{children}
		</div>
	);
}

export { Terminal, TypingAnimation, AnimatedSpan };

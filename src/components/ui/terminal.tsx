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
				"relative w-full rounded-xl border border-border bg-muted p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-sm",
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

function PersonalInfo() {
	return (
		<Terminal>
			<TypingAnimation className="text-green-500" delay="0ms">
				&gt; whoami
			</TypingAnimation>
			<AnimatedSpan delay="1200ms">Vert San — Full-Stack Developer</AnimatedSpan>

			<TypingAnimation className="text-green-500" delay="2400ms">
				&gt; email
			</TypingAnimation>
			<AnimatedSpan delay="3600ms">itsanvert@gmail.com</AnimatedSpan>

			<TypingAnimation className="text-green-500" delay="4800ms">
				&gt; github
			</TypingAnimation>
			<AnimatedSpan delay="6000ms">github.com/vertsan</AnimatedSpan>

			<TypingAnimation className="text-green-500" delay="7200ms">
				&gt; linkedin
			</TypingAnimation>
			<AnimatedSpan delay="8400ms">linkedin.com/in/vertsan</AnimatedSpan>

			<TypingAnimation className="text-green-500" delay="9600ms">
				&gt; location
			</TypingAnimation>
			<AnimatedSpan delay="10800ms">Cambodia</AnimatedSpan>

			<TypingAnimation className="text-muted-foreground" delay="12000ms">
				Ready. Type a command or wait for next update.
			</TypingAnimation>
		</Terminal>
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

export { Terminal, TypingAnimation, AnimatedSpan, PersonalInfo };

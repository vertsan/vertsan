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
				"w-full min-w-0 overflow-hidden rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-lg",
				"bg-[#1a1b26] text-[#c0caf5] shadow-black/30 ring-1 ring-white/10",
				className,
			)}
			{...props}
		>
			<div className="mb-3 flex items-center gap-1.5">
				<span className="size-2.5 rounded-full bg-[#f7768e]" />
				<span className="size-2.5 rounded-full bg-[#e0af68]" />
				<span className="size-2.5 rounded-full bg-[#73daca]" />
			</div>
			<div className="min-w-0 space-y-1.5">{children}</div>
		</div>
	);
}

function PersonalInfo() {
	return (
		<Terminal>
			<div className="mb-2 flex min-w-0 items-center justify-between gap-2 whitespace-nowrap text-[0.65rem] uppercase tracking-widest text-[#565f89]">
				<span className="truncate">vert@dev — zsh</span>
				<span className="flex shrink-0 items-center gap-1.5">
					<span className="size-1.5 rounded-full bg-[#7dcfff]" />
					connected
				</span>
			</div>

			<TypingAnimation className="text-[#7dcfff]" delay="0ms">
				&gt; whoami
			</TypingAnimation>
			<AnimatedSpan className="text-[#73daca]" delay="1200ms">
				Vert San — Software Engineer
			</AnimatedSpan>

			<TypingAnimation className="text-[#7dcfff]" delay="2400ms">
				&gt; email
			</TypingAnimation>
			<AnimatedSpan className="text-[#73daca]" delay="3600ms">
				itsanvert@gmail.com
			</AnimatedSpan>

			<TypingAnimation className="text-[#7dcfff]" delay="4800ms">
				&gt; github
			</TypingAnimation>
			<AnimatedSpan className="text-[#73daca]" delay="6000ms">
				github.com/vertsan
			</AnimatedSpan>

			<TypingAnimation className="text-[#7dcfff]" delay="7200ms">
				&gt; linkedin
			</TypingAnimation>
			<AnimatedSpan className="text-[#73daca]" delay="8400ms">
				linkedin.com/in/vertsan
			</AnimatedSpan>

			<TypingAnimation className="text-[#7dcfff]" delay="9600ms">
				&gt; location
			</TypingAnimation>
			<AnimatedSpan className="text-[#73daca]" delay="10800ms">
				Cambodia
			</AnimatedSpan>

			<TypingAnimation className="text-[#565f89]" delay="12000ms">
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

import { Store } from "@tanstack/store";
import {
	AlertCircle,
	Bot,
	Briefcase,
	Send,
	UserCheck,
	WifiOff,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import type { ResumeChatMessages } from "#/lib/resume-ai-hook";
import { useResumeChat } from "#/lib/resume-ai-hook";
import { cn } from "#/lib/utils";

function Messages({ messages }: { messages: ResumeChatMessages }) {
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	}, [messages]);

	if (!messages.length) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/60 text-sm px-6 py-8">
				<div className="relative mb-4">
					<Briefcase className="size-12 text-primary/40 animate-pulse" />
					<UserCheck className="size-6 text-primary/60 absolute -bottom-1 -right-1" />
				</div>
				<p className="text-center text-foreground/80 font-medium">
					Welcome, Recruiter!
				</p>
				<p className="text-xs text-muted-foreground/40 mt-2 text-center max-w-[200px]">
					Ask about skills, experience, or qualifications...
				</p>
			</div>
		);
	}

	return (
		<div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
			{messages.map(({ id, role, parts }) => (
				<div
					key={id}
					className={cn("py-3", role === "assistant" && "bg-muted/30")}
				>
					{parts.map((part, index) => {
						if (part.type === "text" && part.content) {
							return (
								<div key={index} className="flex items-start gap-3 px-4">
									{role === "assistant" ? (
										<div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
											<Bot className="size-4 text-primary" />
										</div>
									) : (
										<div className="size-7 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
											You
										</div>
									)}
									<div className="flex-1 min-w-0 text-foreground prose dark:prose-invert max-w-none prose-sm">
										{part.content}
									</div>
								</div>
							);
						}
						return null;
					})}
				</div>
			))}
		</div>
	);
}

// Export store for header control
export const showResumeAssistant = new Store(false);

export default function ResumeAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const { messages, sendMessage, isLoading, error } = useResumeChat();
	const [input, setInput] = useState("");

	// Sync with store for header control
	useEffect(() => {
		const sub = showResumeAssistant.subscribe(() => {
			setIsOpen(showResumeAssistant.state);
		});
		return () => sub.unsubscribe();
	}, []);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		showResumeAssistant.setState(() => newState);
	};

	const handleSend = () => {
		if (input.trim()) {
			sendMessage(input);
			setInput("");
		}
	};

	if (!isOpen) return null;

	const isOffline =
		error?.message?.includes("fetch") || error?.message?.includes("network");

	return (
		<div className="fixed top-20 right-4 z-[100] w-[400px] h-[520px] rounded-xl shadow-2xl flex flex-col overflow-hidden border bg-card text-card-foreground">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
						<Briefcase className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold text-sm tracking-tight">
							Resume Assistant
						</h3>
						<p className="text-xs text-muted-foreground">
							Candidate Evaluation AI
						</p>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleToggle}
					aria-label="Close"
				>
					<X className="size-4" />
				</Button>
			</div>

			{/* Messages */}
			<Messages messages={messages} />

			{/* Error banner */}
			{error && !isLoading && (
				<div className="mx-4 mb-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
					{isOffline ? (
						<WifiOff className="size-4 text-destructive shrink-0 mt-0.5" />
					) : (
						<AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
					)}
					<div className="text-xs text-destructive">
						<p className="font-medium mb-0.5">
							{isOffline
								? "Cannot reach the AI service"
								: "Failed to get response"}
						</p>
						<p className="text-destructive/80">
							{isOffline
								? "Make sure Ollama is running locally (ollama run mistral:7b), or set ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY."
								: error.message}
						</p>
					</div>
				</div>
			)}

			{/* Loading indicator */}
			{isLoading && (
				<div className="px-4 py-3 border-t">
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<div className="flex gap-1">
							<span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
							<span className="size-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
							<span className="size-2 bg-primary/40 rounded-full animate-bounce" />
						</div>
						<span className="font-medium">Analyzing experience...</span>
					</div>
				</div>
			)}

			{/* Input */}
			<div className="p-4 border-t bg-muted/20">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSend();
					}}
				>
					<div className="relative">
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask about skills, experience, or qualifications..."
							disabled={isLoading}
							className="w-full rounded-lg border bg-background pl-4 pr-12 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden disabled:opacity-50 transition-all"
							rows={1}
							style={{ minHeight: "48px", maxHeight: "100px" }}
							onInput={(e) => {
								const target = e.target as HTMLTextAreaElement;
								target.style.height = "auto";
								target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
							}}
							onKeyDown={(e) => {
								if (
									e.key === "Enter" &&
									!e.shiftKey &&
									input.trim() &&
									!isLoading
								) {
									e.preventDefault();
									handleSend();
								}
							}}
						/>
						<Button
							type="submit"
							size="icon"
							disabled={!input.trim() || isLoading}
							className="absolute right-2 top-1/2 -translate-y-1/2"
						>
							<Send className="size-4" />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

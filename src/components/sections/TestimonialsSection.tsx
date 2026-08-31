import { motion } from "framer-motion";
import { Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "#/components/ui/button";
import SectionHeading from "#/components/ui/section-heading";
import { cn } from "#/lib/utils";
import { Marquee } from "#/registry/magicui/marquee";

interface TestimonialItem {
	id: number;
	userId: number;
	authorName: string;
	authorAvatar: string | null;
	authorProfileUrl: string | null;
	provider: string;
	content: string;
	createdAt: string;
}

interface OAuthUser {
	id: number;
	name: string;
	email?: string;
	avatar?: string;
	provider: string;
}

const ReviewCard = ({
	authorName,
	authorAvatar,
	authorProfileUrl,
	content,
	provider,
	createdAt,
}: {
	authorName: string;
	authorAvatar: string | null;
	authorProfileUrl: string | null;
	content: string;
	provider: string;
	createdAt: string;
}) => {
	const providerLabel = provider === "google" ? "Google" : "GitHub";
	const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const cardContent = (
		<>
			<div className="flex flex-row items-center gap-2">
				{authorAvatar ? (
					<img
						className="rounded-full"
						width="32"
						height="32"
						alt={authorName}
						src={authorAvatar}
						loading="lazy"
						decoding="async"
					/>
				) : (
					<div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
						{authorName.charAt(0).toUpperCase()}
					</div>
				)}
				<div className="flex flex-col">
					<figcaption className="text-sm font-medium dark:text-white">
						{authorName}
					</figcaption>
					<p className="text-xs font-medium dark:text-white/40">
						{providerLabel} · {dateStr}
					</p>
				</div>
			</div>
			<blockquote className="mt-2 text-sm">{content}</blockquote>
		</>
	);

	if (authorProfileUrl) {
		return (
			<a
				href={authorProfileUrl}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"block relative h-full w-[15rem] sm:w-72 shrink-0 overflow-hidden rounded-2xl border p-4 transition-all duration-300",
					"border-border/60 bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5",
				)}
			>
				{cardContent}
			</a>
		);
	}

	return (
		<figure
			className={cn(
				"relative h-full w-[15rem] sm:w-72 shrink-0 overflow-hidden rounded-2xl border p-4 transition-all duration-300",
				"border-border/60 bg-card/70 backdrop-blur-sm shadow-sm",
			)}
		>
			{cardContent}
		</figure>
	);
};

export default function TestimonialsSection() {
	const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useState<OAuthUser | null>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [newContent, setNewContent] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const fetchTestimonials = useCallback(async () => {
		try {
			const res = await fetch("/api/testimonials");
			const data = await res.json();
			if (data.items) setTestimonials(data.items);
		} catch {
			// silent
		} finally {
			setLoading(false);
		}
	}, []);

	const checkAuth = useCallback(async () => {
		try {
			const res = await fetch("/api/auth/check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (data.authenticated && data.user) {
				setAuthUser(data.user);
			} else {
				setAuthUser(null);
			}
		} catch {
			setAuthUser(null);
		} finally {
			setAuthLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTestimonials();
		checkAuth();
	}, [fetchTestimonials, checkAuth]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newContent.trim() || submitting) return;

		setSubmitting(true);
		setSubmitMessage(null);

		try {
			const res = await fetch("/api/testimonials", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "create", content: newContent.trim() }),
			});
			const data = await res.json();

			if (!res.ok) {
				setSubmitMessage({
					type: "error",
					text: data.error || "Failed to submit",
				});
				return;
			}

			if (data.item) {
				setTestimonials((prev) => [data.item, ...prev]);
			}
			setNewContent("");
			setSubmitMessage({ type: "success", text: "Testimonial submitted!" });
		} catch {
			setSubmitMessage({ type: "error", text: "Connection error" });
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const res = await fetch("/api/testimonials", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "delete", testimonialId: id }),
			});
			if (res.ok) {
				setTestimonials((prev) => prev.filter((t) => t.id !== id));
			}
		} catch {
			// silent
		}
	};

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch {
			// silent
		}
		setAuthUser(null);
	};

	const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
	const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

	return (
		<section className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:px-8">
			<div className="mx-auto max-w-5xl w-full space-y-10 md:space-y-16">
				<SectionHeading
					eyebrow="Feedback"
					title="Testimonials"
					description="What people say about working with me"
				/>

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<div className="size-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
					</div>
				) : testimonials.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center py-12 text-muted-foreground"
					>
						<p className="text-lg">No testimonials yet.</p>
						<p className="mt-1 text-sm">
							Be the first to leave a review by signing in below.
						</p>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-50px" }}
						transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
						className="relative flex w-full flex-col items-center justify-center overflow-hidden"
					>
						<Marquee pauseOnHover className="[--duration:20s]">
							{firstRow.map((review) => (
								<ReviewCard
									key={review.id}
									authorName={review.authorName}
									authorAvatar={review.authorAvatar}
									authorProfileUrl={review.authorProfileUrl}
									content={review.content}
									provider={review.provider}
									createdAt={review.createdAt}
								/>
							))}
						</Marquee>
						{secondRow.length > 0 && (
							<Marquee reverse pauseOnHover className="[--duration:20s]">
								{secondRow.map((review) => (
									<ReviewCard
										key={review.id}
										authorName={review.authorName}
										authorAvatar={review.authorAvatar}
										authorProfileUrl={review.authorProfileUrl}
										content={review.content}
										provider={review.provider}
										createdAt={review.createdAt}
									/>
								))}
							</Marquee>
						)}
						<div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
						<div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mx-auto max-w-lg space-y-6"
				>
					{authLoading ? (
						<div className="flex justify-center py-4">
							<div className="size-6 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
						</div>
					) : authUser ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className="space-y-5"
						>
							<div className="flex items-center justify-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
								{authUser.avatar ? (
									<img
										src={authUser.avatar}
										alt={authUser.name}
										className="size-12 rounded-full ring-2 ring-primary/20"
										loading="lazy"
										decoding="async"
									/>
								) : (
									<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
										{authUser.name.charAt(0).toUpperCase()}
									</div>
								)}
								<div className="flex-1 text-left">
									<p className="text-sm font-semibold">{authUser.name}</p>
									<p className="text-xs text-muted-foreground">
										{authUser.provider === "github" ? "GitHub" : "Google"}
									</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleLogout}
									className="text-xs text-muted-foreground hover:text-destructive"
								>
									Sign out
								</Button>
							</div>

							{submitMessage?.type === "success" ? (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900/50 dark:bg-green-950/30"
								>
									<p className="text-sm font-medium text-green-700 dark:text-green-400">
										Thank you! Your testimonial has been submitted.
									</p>
									<button
										type="button"
										onClick={() => {
											setSubmitMessage(null);
											setNewContent("");
										}}
										className="mt-2 text-xs text-green-600 underline hover:text-green-800 dark:text-green-500 dark:hover:text-green-300"
									>
										Write another
									</button>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-3">
									<textarea
										value={newContent}
										onChange={(e) => setNewContent(e.target.value)}
										placeholder="Share your experience working with me..."
										maxLength={500}
										rows={4}
										className="w-full resize-none rounded-xl border bg-card px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
									/>
									<div className="flex items-center justify-between">
										<p className="text-xs text-muted-foreground">
											{newContent.length}/500
										</p>
										<Button
											type="submit"
											size="sm"
											disabled={!newContent.trim() || submitting}
											className="gap-1.5"
										>
											{submitting ? (
												<div className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
											) : (
												<Send className="size-3.5" />
											)}
											Submit
										</Button>
									</div>
									{submitMessage?.type === "error" && (
										<p className="text-center text-xs text-red-600 dark:text-red-400">
											{submitMessage.text}
										</p>
									)}
								</form>
							)}

							{testimonials.some((t) => t.userId === authUser.id) && (
								<div className="space-y-2">
									<p className="text-center text-xs text-muted-foreground">
										Your testimonials
									</p>
									<div className="space-y-2">
										{testimonials
											.filter((t) => t.userId === authUser.id)
											.map((t) => (
												<div
													key={t.id}
													className="flex items-start justify-between gap-2 rounded-lg border bg-background/50 px-3 py-2"
												>
													<p className="line-clamp-2 flex-1 text-xs">
														{t.content}
													</p>
													<button
														type="button"
														onClick={() => handleDelete(t.id)}
														className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
														aria-label="Delete testimonial"
													>
														<Trash2 className="size-3.5" />
													</button>
												</div>
											))}
									</div>
								</div>
							)}
						</motion.div>
					) : (
						<div className="space-y-4">
							<p className="text-center text-sm text-muted-foreground">
								Sign in to leave a testimonial
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
								<Button
									variant="outline"
									size="sm"
									onClick={() => (window.location.href = "/api/auth/github")}
									className="gap-2"
								>
									<FaGithub className="size-4" />
									GitHub
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => (window.location.href = "/api/auth/google")}
									className="gap-2"
								>
									<FaGoogle className="size-4" />
									Google
								</Button>
							</div>
						</div>
					)}
				</motion.div>
			</div>
		</section>
	);
}

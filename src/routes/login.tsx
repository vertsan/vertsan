import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, LogIn, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function InteractiveSide() {
	return (
		<div className="hidden lg:flex relative w-[55%] shrink-0 overflow-hidden bg-gradient-to-br from-primary/5 via-primary/[0.01] to-background">
			<FlickeringGrid
				className="absolute inset-0 size-full"
				squareSize={4}
				gridGap={10}
				color="rgb(14, 165, 233)"
				maxOpacity={0.06}
				flickerChance={0.3}
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/10" />

			<div className="absolute inset-0 flex flex-col items-center justify-center p-16">
				<div className="text-center space-y-5">
					<div className="inline-flex size-14 rounded-xl bg-primary/5 border border-primary/10 items-center justify-center mx-auto">
						<Lock className="size-6 text-primary/60" />
					</div>
					<div className="space-y-2">
						<h1 className="text-4xl font-bold text-foreground tracking-tight">
							vert
						</h1>
						<p className="text-muted-foreground/50 text-base max-w-xs mx-auto leading-relaxed">
							Content Management System
						</p>
					</div>
				</div>

				<div className="absolute bottom-16 flex items-center gap-3">
					<div className="h-px w-16 bg-border/50" />
					<div className="flex gap-1.5">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="size-1 rounded-full bg-border/40"
							/>
						))}
					</div>
					<div className="h-px w-16 bg-border/50" />
				</div>
			</div>
		</div>
	);
}

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const usernameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetch("/api/admin/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "check" }),
		})
			.then((r) => r.json())
			.then((d) => {
				if (d.authenticated) {
					router.navigate({ to: "/admin" });
				}
			})
			.catch(() => {});
	}, [router]);

	useEffect(() => {
		usernameRef.current?.focus();
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "login",
					username,
					password,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Invalid credentials");
				return;
			}

			router.navigate({ to: "/admin" });
		} catch {
			setError("Connection error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="h-dvh flex bg-background font-admin overflow-hidden">
			<InteractiveSide />

			<div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto">
				<div className="w-full max-w-[440px] space-y-6">
					<Link
						to="/"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/50 hover:text-foreground hover:underline underline-offset-4 transition-colors duration-200 py-1 -ml-1 px-1"
					>
						<ArrowLeft className="size-3.5" />
						Back to site
					</Link>

					<div className="bg-white dark:bg-card rounded-2xl border border-border/50 shadow-lg p-8 sm:p-10">
						<div className="space-y-1 mb-10">
							<h1 className="text-[44px] font-bold tracking-tight text-foreground leading-none">
								Sign in
							</h1>
							<p className="text-base text-muted-foreground/70 font-medium mt-4">
								Enter your credentials to access your dashboard.
							</p>
						</div>

						<form onSubmit={handleSubmit}>
							<div className="space-y-6">
								<div className="space-y-2">
									<label
										htmlFor="username"
										className="text-sm font-medium text-foreground/80"
									>
										Username
									</label>
									<input
										ref={usernameRef}
										id="username"
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Enter your username"
										className="w-full h-14 rounded-[14px] border border-[#E5E7EB] dark:border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#111827] dark:focus:border-white focus:ring-[3px] focus:ring-[rgba(17,24,39,.1)] dark:focus:ring-[rgba(255,255,255,.1)] focus:bg-background transition-all duration-200"
										autoComplete="username"
									/>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label
											htmlFor="password"
											className="text-sm font-medium text-foreground/80"
										>
											Password
										</label>
									</div>
									<div className="relative">
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your password"
											className="w-full h-14 rounded-[14px] border border-[#E5E7EB] dark:border-border bg-background px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#111827] dark:focus:border-white focus:ring-[3px] focus:ring-[rgba(17,24,39,.1)] dark:focus:ring-[rgba(255,255,255,.1)] focus:bg-background transition-all duration-200"
											autoComplete="current-password"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
											aria-label={showPassword ? "Hide password" : "Show password"}
											tabIndex={-1}
										>
											{showPassword ? (
												<EyeOff className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</button>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between mt-6 mb-8">
								<label className="flex items-center gap-2.5 cursor-pointer group">
									<div className="relative">
										<input
											type="checkbox"
											checked={remember}
											onChange={(e) => setRemember(e.target.checked)}
											className="peer sr-only"
										/>
										<div className="size-4 rounded-[4px] border border-[#E5E7EB] dark:border-border bg-background peer-checked:bg-foreground peer-checked:border-foreground transition-all duration-200 group-hover:border-muted-foreground/40" />
										{remember && (
											<svg
												className="absolute inset-0 size-4 p-[3px] text-background"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</div>
									<span className="text-sm text-muted-foreground/60 group-hover:text-foreground/70 transition-colors duration-200 select-none">
										Remember me
									</span>
								</label>
							</div>

							{error && (
								<div className="rounded-[14px] bg-destructive/5 border border-destructive/10 px-4 py-3.5 mb-6" role="alert">
									<p className="text-sm text-destructive text-center font-medium">
										{error}
									</p>
								</div>
							)}

							<Button
								type="submit"
								size="lg"
								className="w-full gap-2 h-14 rounded-[14px] text-base font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:active:scale-100"
								disabled={loading}
							>
								{loading ? (
									<>
										<svg
											className="animate-spin size-5"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
										</svg>
										Signing in...
									</>
								) : (
									<>
										<LogIn className="size-5" />
										Sign In
									</>
								)}
							</Button>
						</form>
					</div>

					<p className="text-sm text-[#6B7280] dark:text-muted-foreground/60 text-center pt-2">
						&copy; {new Date().getFullYear()} VertSan. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}

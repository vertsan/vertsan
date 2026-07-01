import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";
import { AuroraText } from "#/components/ui/aurora-text";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function InteractiveSide() {
	return (
		<div className="hidden lg:flex relative w-[55%] shrink-0 overflow-hidden bg-gradient-to-br from-primary/[0.04] via-primary/[0.01] to-background">
			<FlickeringGrid
				className="absolute inset-0 size-full"
				squareSize={4}
				gridGap={10}
				color="rgb(14, 165, 233)"
				maxOpacity={0.05}
				flickerChance={0.3}
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/5" />

			<div className="absolute inset-0 flex flex-col items-center justify-center p-16">
				<div className="text-center space-y-6">
					<AuroraText
						className="text-6xl sm:text-7xl font-bold tracking-tight leading-none"
						colors={["#4ade80", "#38bdf8", "#a78bfa", "#fbbf24"]}
					>
						vert
					</AuroraText>
					<p className="text-muted-foreground/50 text-base max-w-xs mx-auto leading-relaxed">
						Content Management System
					</p>
				</div>

				<div className="absolute bottom-16 flex items-center gap-3">
					<div className="h-px w-16 bg-border/30" />
					<div className="flex gap-1.5">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="size-1 rounded-full bg-border/30"
							/>
						))}
					</div>
					<div className="h-px w-16 bg-border/30" />
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
				<div className="w-full max-w-[400px] space-y-8">
					<Link
						to="/"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/40 hover:text-foreground transition-colors duration-200"
					>
						<ArrowLeft className="size-3.5" />
						Back to site
					</Link>

					<div className="space-y-8">
						<div className="space-y-1.5">
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								Sign in
							</h1>
							<p className="text-sm text-muted-foreground/60">
								Enter your credentials to access your dashboard.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="space-y-1.5">
								<label htmlFor="username" className="text-sm font-medium text-foreground/80">
									Username
								</label>
								<input
									ref={usernameRef}
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Enter your username"
									className="w-full h-11 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
									autoComplete="username"
								/>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="password" className="text-sm font-medium text-foreground/80">
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										className="w-full h-11 rounded-lg border border-border bg-background px-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
										aria-label={showPassword ? "Hide password" : "Show password"}
										tabIndex={-1}
									>
										{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
									</button>
								</div>
							</div>

							<label className="flex items-center gap-2 cursor-pointer group">
								<input
									type="checkbox"
									checked={remember}
									onChange={(e) => setRemember(e.target.checked)}
									className="size-4 rounded border-border text-foreground focus:ring-primary/30 focus:ring-offset-0 cursor-pointer"
								/>
								<span className="text-sm text-muted-foreground/60 group-hover:text-foreground/70 transition-colors select-none">
									Remember me
								</span>
							</label>

							{error && (
								<div className="rounded-lg bg-destructive/5 border border-destructive/10 px-4 py-3" role="alert">
									<p className="text-sm text-destructive text-center font-medium">{error}</p>
								</div>
							)}

							<Button
								type="submit"
								size="lg"
								className="w-full gap-2 h-11 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={loading}
							>
								{loading ? (
									<>
										<svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
										</svg>
										Signing in...
									</>
								) : (
									<>
										<LogIn className="size-4" />
										Sign In
									</>
								)}
							</Button>
						</form>
					</div>

					<p className="text-xs text-muted-foreground/40 text-center">
						&copy; {new Date().getFullYear()} VertSan. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}

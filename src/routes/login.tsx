import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FlickeringGrid } from "#/registry/magicui/flickering-grid";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function InteractiveSide() {
	return (
		<div className="hidden lg:flex relative w-[55%] shrink-0 overflow-hidden bg-gradient-to-br from-primary/[0.07] via-primary/[0.02] to-background">
			<FlickeringGrid
				className="absolute inset-0 size-full"
				squareSize={6}
				gridGap={8}
				color="rgb(14, 165, 233)"
				maxOpacity={0.08}
				flickerChance={0.4}
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/20" />

			<div className="absolute inset-0 flex flex-col items-center justify-center p-16">
				<div className="text-center space-y-4">
					<div className="inline-flex size-16 rounded-2xl bg-primary/5 border border-primary/10 items-center justify-center mb-2">
						<Lock className="size-7 text-primary/70" />
					</div>
					<h1 className="text-4xl font-bold text-foreground tracking-tight">
						vert
					</h1>
					<p className="text-muted-foreground/60 text-lg max-w-sm mx-auto leading-relaxed">
						Content Management System
					</p>
				</div>

				<div className="absolute bottom-16 flex items-center gap-3">
					<div className="h-px w-12 bg-border" />
					<div className="flex gap-1.5">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="size-1.5 rounded-full bg-border"
							/>
						))}
					</div>
					<div className="h-px w-12 bg-border" />
				</div>
			</div>
		</div>
	);
}

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
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

			<div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
				<div className="w-full max-w-sm">
					<Link
						to="/"
						className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
					>
						<ArrowLeft className="size-3" />
						Back to site
					</Link>

					<div className="space-y-2 mb-8">
						<h1 className="text-2xl font-bold tracking-tight">
							Welcome back
						</h1>
						<p className="text-sm text-muted-foreground">
							Sign in to manage your content
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1.5">
							<label
								htmlFor="username"
								className="text-xs font-medium text-muted-foreground"
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
								className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
								autoComplete="username"
							/>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="text-xs font-medium text-muted-foreground"
								>
									Password
								</label>
							</div>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
								autoComplete="current-password"
							/>
						</div>

						{error && (
							<p className="text-sm text-destructive text-center bg-destructive/5 rounded-lg px-3 py-2">
								{error}
							</p>
						)}

						<Button
							type="submit"
							className="w-full gap-2 rounded-lg h-10"
							disabled={loading}
						>
							<LogIn className="size-4" />
							{loading ? "Please wait..." : "Sign In"}
						</Button>
					</form>	
				</div>
			</div>
		</div>
	);
}

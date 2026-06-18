import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

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
		<div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-background px-4 font-admin">
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/[0.03] dark:bg-primary/[0.02]" />
				<div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/[0.03] dark:bg-primary/[0.02]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full border border-border/30" />
			</div>

			<div className="relative w-full max-w-sm">
				<Link
					to="/"
					className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
				>
					<ArrowLeft className="size-3" />
					Back to site
				</Link>

				<div className="rounded-[20px] border border-[#e5e7eb] dark:border-border bg-white dark:bg-card p-8 shadow-sm">
					<div className="text-center space-y-2 mb-7">
						<div className="mx-auto size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3">
							<Lock className="size-5 text-primary" />
						</div>
						<h1 className="text-xl font-bold tracking-tight">
							Sign In
						</h1>
						<p className="text-sm text-muted-foreground">
							Sign in to manage your content
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-3.5">
						<div>
							<input
								ref={usernameRef}
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Username"
								className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
								autoComplete="username"
							/>
						</div>

						<div>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
								autoComplete="current-password"
							/>
						</div>

						{error && (
							<p className="text-sm text-destructive text-center bg-destructive/5 rounded-xl px-3 py-2">{error}</p>
						)}

						<Button type="submit" className="w-full gap-2 rounded-xl h-10" disabled={loading}>
							<LogIn className="size-4" />
							{loading ? "Please wait..." : "Sign In"}
						</Button>
					</form>
				</div>

				<p className="text-xs text-muted-foreground/50 text-center mt-6">
					VertSan Content Manager
				</p>
			</div>
		</div>
	);
}

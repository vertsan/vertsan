import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

type Mode = "login" | "register";

function LoginPage() {
	const [mode, setMode] = useState<Mode>("login");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const usernameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Check if any users exist
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
					action: mode === "login" ? "login" : "register",
					username,
					password,
					...(mode === "register" ? { name: name || username } : {}),
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				if (data.error?.toLowerCase().includes("already exist") || data.error?.toLowerCase().includes("contact an admin")) {
					setMode("login");
				}
				setError(data.error || (mode === "login" ? "Invalid credentials" : "Registration failed"));
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
							{mode === "login" ? <Lock className="size-5 text-primary" /> : <UserPlus className="size-5 text-primary" />}
						</div>
						<h1 className="text-xl font-bold tracking-tight">
							{mode === "login" ? "CMS Login" : "Create Admin"}
						</h1>
						<p className="text-sm text-muted-foreground">
							{mode === "login" ? "Sign in to manage your content" : "Set up your first admin account"}
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

						{mode === "register" && (
							<div>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Display Name (optional)"
									className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
								/>
							</div>
						)}

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
							{mode === "login" ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
							{loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
						</Button>
					</form>

					<div className="mt-5 pt-4 border-t border-border text-center">
						<button
							type="button"
							onClick={() => {
								setMode(mode === "login" ? "register" : "login");
								setError("");
							}}
							className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
						>
							{mode === "login"
								? "No account? Register as admin"
								: "Already have an account? Sign in"}
						</button>
					</div>
				</div>

				<p className="text-xs text-muted-foreground/50 text-center mt-6">
					VertSan Content Manager
				</p>
			</div>
		</div>
	);
}

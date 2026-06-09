import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lock, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "login", password }),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error || "Login failed");
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
		<div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
			<div className="w-full max-w-sm space-y-6">
				<div className="text-center space-y-2">
					<div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center">
						<Lock className="size-6 text-primary" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight">CMS Login</h1>
					<p className="text-sm text-muted-foreground">
						Enter your password to manage content
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							ref={inputRef}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
							autoComplete="current-password"
						/>
					</div>

					{error && (
						<p className="text-sm text-destructive text-center">{error}</p>
					)}

					<Button type="submit" className="w-full gap-2" disabled={loading}>
						<LogIn className="size-4" />
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</div>
		</div>
	);
}

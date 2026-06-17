import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";

export type UserRole = "admin" | "reader";

export interface AuthUser {
	id: number;
	username: string;
	name: string;
	role: UserRole;
}

interface AuthContextType {
	user: AuthUser | null;
	loading: boolean;
	error: string;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const router = useRouter();

	const checkSession = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "check" }),
			});
			const data = await res.json();
			if (data.authenticated && data.user) {
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		checkSession();
	}, [checkSession]);

	const login = useCallback(async (username: string, password: string): Promise<boolean> => {
		setError("");
		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "login", username, password }),
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Login failed");
				return false;
			}
			setUser(data.user);
			return true;
		} catch {
			setError("Connection error");
			return false;
		}
	}, []);

	const logout = useCallback(async () => {
		try {
			await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "logout" }),
			});
		} catch {
			// ignore
		}
		setUser(null);
		router.navigate({ to: "/login" });
	}, [router]);

	return (
		<AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin: user?.role === "admin" }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

import { Loader2 } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "#/lib/admin/auth-context";

interface Props {
	children: ReactNode;
}

function AuthGuardInner({ children }: Props) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.navigate({ to: "/login" });
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-background">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="size-6 animate-spin text-muted-foreground" />
					<p className="text-sm text-muted-foreground">Verifying session...</p>
				</div>
			</div>
		);
	}

	if (!user) return null;

	return <>{children}</>;
}

export default function AuthGuard({ children }: Props) {
	return (
		<AuthProvider>
			<AuthGuardInner>{children}</AuthGuardInner>
		</AuthProvider>
	);
}

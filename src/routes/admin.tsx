import { createFileRoute, Outlet } from "@tanstack/react-router";
import AdminSidebar from "#/components/admin/AdminSidebar";
import AuthGuard from "#/components/admin/AuthGuard";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<AuthGuard>
			<div className="flex min-h-screen">
				<AdminSidebar />
				<main className="flex-1 p-8">
					<Outlet />
				</main>
			</div>
		</AuthGuard>
	);
}

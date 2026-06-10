import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import AdminSidebar from "#/components/admin/AdminSidebar";
import AdminHeader from "#/components/admin/AdminHeader";
import AdminFooter from "#/components/admin/AdminFooter";
import AuthGuard from "#/components/admin/AuthGuard";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<AuthGuard>
			<div className="min-h-screen flex flex-col bg-background">
				<AdminHeader
					onToggleSidebar={() => setSidebarOpen((v) => !v)}
					sidebarOpen={sidebarOpen}
				/>
				<div className="flex flex-1">
					<AdminSidebar
						open={sidebarOpen}
						onClose={() => setSidebarOpen(false)}
					/>
					<main className="flex-1 p-6 lg:p-8 min-w-0">
						<Outlet />
					</main>
				</div>
				<AdminFooter />
			</div>
		</AuthGuard>
	);
}

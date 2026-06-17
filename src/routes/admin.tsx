import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import AdminSidebar from "#/components/admin/AdminSidebar";
import AdminHeader from "#/components/admin/AdminHeader";
import AuthGuard from "#/components/admin/AuthGuard";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<AuthGuard>
			<div className="min-h-screen flex flex-col font-admin bg-[#fafafa] dark:bg-background">
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
			</div>
		</AuthGuard>
	);
}

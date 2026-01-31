import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getMeQueryOptions } from '@/http/requests/authentication';
import { authStore } from '@/integrations/tanstack-store/stores/auth.store';

export const Route = createFileRoute('/_home')({
	beforeLoad: ({ location }) => {
		const token = authStore.state.token;

		if (!token) {
			throw redirect({
				to: '/login',
				search: { redirect: location.href },
			});
		}
	},

	loader: async ({ context: { queryClient } }) => {
		const userData = await queryClient.ensureQueryData(getMeQueryOptions());

		authStore.setState(prev => ({
			...prev,
			user: userData,
		}));
	},
	component: Layout,
});

function Layout() {
	return (
		<SidebarProvider>
			<AppSidebar />

			<main className="p-4 flex-1">
				<div className="flex items-center justify-between">
					<SidebarTrigger />
					<Header />
				</div>
				<Outlet />
			</main>
		</SidebarProvider>
	);
}

import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from '@tanstack/react-router';
import { ThemeToggler } from '@/components/theme/theme-toggler';
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

	loader: ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData(getMeQueryOptions());
	},
	component: Layout,
});

function Layout() {
	return (
		<>
			<div className="flex items-center justify-between p-2">
				<div className="p-2 flex gap-2">
					<Link to="/" className="[&.active]:font-bold">
						Home
					</Link>
					<Link to="/about" className="[&.active]:font-bold">
						About
					</Link>
				</div>
				<ThemeToggler />
			</div>
			<hr />

			<div className="p-4">
				<Outlet />
			</div>
		</>
	);
}

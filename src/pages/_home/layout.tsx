import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from '@tanstack/react-router';
import { ThemeToggler } from '@/components/theme/theme-toggler';
import { getMeQueryOptions } from '@/http/requests/authentication';
import {
	authStore,
	useAuth,
} from '@/integrations/tanstack-store/stores/auth.store';

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
	const { user } = useAuth();
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
				<div className="flex items-center">
					{user && <span className="mr-4">Hello, {user.username}</span>}
					<ThemeToggler />
				</div>
			</div>
			<hr />

			<div className="p-4">
				<Outlet />
			</div>
		</>
	);
}

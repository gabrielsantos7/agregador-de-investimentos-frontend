import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useNavigate,
} from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggler } from '@/components/theme/theme-toggler';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { getMeQueryOptions } from '@/http/requests/authentication';
import {
	authStore,
	logout,
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
	const navigate = useNavigate();

	const onLogout = () => {
		logout();
		toast.success('Logged out', {
			description: 'You have been logged out successfully.',
		});
		navigate({ to: '/login', replace: true });
	};

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
				<div className="flex items-center gap-4">
					{user && (
						<>
							<span className="mr-4">Hello, {user.username}</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" onClick={onLogout}>
										<LogOut strokeWidth={2.5} />
										<span className="sr-only">Logout</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<p>Logout</p>
								</TooltipContent>
							</Tooltip>
						</>
					)}
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

import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { ThemeToggler } from '@/components/theme/theme-toggler';

export const Route = createFileRoute('/_home')({
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

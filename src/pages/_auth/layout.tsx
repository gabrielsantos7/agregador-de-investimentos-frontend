import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
	component: Layout,
});

function Layout() {
	return (
		<div className="container mx-auto min-h-dvh flex items-center justify-center px-4 bg-linear-to-br from-background/50 via-background to-background/50">
			<Outlet />
		</div>
	);
}

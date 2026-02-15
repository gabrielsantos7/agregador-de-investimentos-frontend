import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
	component: Layout,
});

function Layout() {
	return (
		<div className="mx-auto min-h-dvh flex items-center justify-center bg-linear-to-br from-background/50 via-background to-background/50">
			<Outlet />
		</div>
	);
}

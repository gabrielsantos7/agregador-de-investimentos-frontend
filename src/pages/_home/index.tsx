import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/')({
	component: Home,
	head: () => ({
		meta: [{ title: 'Home' }],
	}),
});

function Home() {
	return <Navigate to="/dashboard" />;
}

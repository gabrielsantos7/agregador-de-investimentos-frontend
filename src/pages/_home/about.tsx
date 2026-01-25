import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/about')({
	component: About,
	head: () => ({
		meta: [{ title: 'About' }],
	}),
});

function About() {
	return <div>Hello "/_home/about"!</div>;
}

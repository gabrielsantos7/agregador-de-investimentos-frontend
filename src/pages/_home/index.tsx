import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/')({
	component: About,
	head: () => ({
		meta: [{ title: 'Home' }],
	}),
});

function About() {
	return <p>Hello "/"!</p>;
}

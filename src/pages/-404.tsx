import { Link } from '@tanstack/react-router';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFound() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
			<div className="flex flex-col items-center gap-6 text-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<FileQuestion className="h-10 w-10 text-muted-foreground" />
				</div>
				<div className="space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">404</h1>
					<p className="text-lg text-muted-foreground">
						This page doesn't exist
					</p>
					<p className="text-sm text-muted-foreground">
						Sorry, we couldn't find the page you're looking for.
					</p>
				</div>
				<Button asChild variant='primary'>
					<Link to="/">Go back home</Link>
				</Button>
			</div>
		</div>
	);
}

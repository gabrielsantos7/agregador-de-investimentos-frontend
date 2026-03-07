import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_home/transactions/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between pt-2">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Transactions</h1>
					<p className="text-muted-foreground">
						View your recent transactions, including buys and sells
					</p>
				</div>
			</div>
		</div>
	);
}

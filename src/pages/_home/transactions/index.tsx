import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeftRight } from 'lucide-react';
import { Loader } from '@/components/shared/loader';
import { Card, CardContent } from '@/components/ui/card';
import {
	Empty,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import {
	getGetTransactionHistoryQueryOptions,
	useGetTransactionHistory,
} from '@/http/requests/trades';
import { TransactionsTable } from './-components/transactions-table';

export const Route = createFileRoute('/_home/transactions/')({
	component: Transactions,
	head: () => ({
		meta: [{ title: 'Transactions' }],
	}),
	loader: async ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getGetTransactionHistoryQueryOptions()),
	pendingComponent: () => <Loader />,
});

function Transactions() {
	const { data: transactionHistoryData, isLoading } =
		useGetTransactionHistory();
	const transactions = Array.isArray(transactionHistoryData)
		? transactionHistoryData
		: [];
	const hasTransactions = transactions.length > 0;

	if (isLoading) {
		return <Loader />;
	}

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
			{hasTransactions ? (
				<Card>
					<CardContent>
						<TransactionsTable data={transactions} />
					</CardContent>
				</Card>
			) : (
				<Empty>
					<EmptyMedia variant="icon">
						<ArrowLeftRight className="size-10" />
					</EmptyMedia>
					<EmptyTitle>No transactions found</EmptyTitle>
					<EmptyDescription>
						Your buy and sell transactions will appear here.
					</EmptyDescription>
				</Empty>
			)}
		</div>
	);
}

import { createFileRoute } from '@tanstack/react-router';
import { Loader } from '@/components/shared/loader';
import { Card, CardContent } from '@/components/ui/card';
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
	const { data: transactionHistoryData } = useGetTransactionHistory();
	const transactions = Array.isArray(transactionHistoryData)
		? transactionHistoryData
		: [];

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
			<Card>
				<CardContent>
					<TransactionsTable data={transactions} />
				</CardContent>
			</Card>
		</div>
	);
}

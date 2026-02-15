import { createFileRoute } from '@tanstack/react-router';
import { Loader } from '@/components/shared/loader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	getGetOwnedStocksQueryOptions,
	useGetOwnedStocks,
} from '@/http/requests/stocks';
import { useListAllAccounts } from '@/http/requests/users';
import { useAuth } from '@/integrations/tanstack-store/stores/auth.store';
import { BuyStockModal } from './-components/buy-stock-modal';

export const Route = createFileRoute('/_home/stocks/')({
	component: Stocks,
	head: () => ({
		meta: [{ title: 'Stocks' }],
	}),
	loader: async ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getGetOwnedStocksQueryOptions()),
	pendingComponent: () => <Loader />,
});

function Stocks() {
	const { user } = useAuth();
	const { data: stocksData } = useGetOwnedStocks();
	const { data: accountsData } = useListAllAccounts(user?.userId || '');
	const accounts = Array.isArray(accountsData) ? accountsData : [];

	return (
		stocksData && (
			<div className="space-y-6">
				<div className="flex items-center justify-between pt-2">
					<div>
						<h1 className="text-2xl font-bold text-foreground">Stocks</h1>
						<p className="text-muted-foreground">
							Explore stock market data, track your investments, and make
							informed decisions
						</p>
					</div>
					<BuyStockModal accounts={accounts} />
				</div>
				<Card>
					<CardHeader></CardHeader>
					<CardContent>
						{/* <DataTable columns={columns} data={} /> */}
					</CardContent>
				</Card>
			</div>
		)
	);
}

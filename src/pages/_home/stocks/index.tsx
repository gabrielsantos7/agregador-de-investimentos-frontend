import { createFileRoute } from '@tanstack/react-router';
import { TrendingUp } from 'lucide-react';
import { Loader } from '@/components/shared/loader';
import { Card, CardContent } from '@/components/ui/card';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import {
	getGetOwnedStocksQueryOptions,
	useGetOwnedStocks,
} from '@/http/requests/stocks';
import { useListAllAccounts } from '@/http/requests/users';
import { useAuth } from '@/integrations/tanstack-store/stores/auth.store';
import { BuyStockModal } from './-components/buy-stock-modal';
import { CreateStockModal } from './-components/create-stock-modal';
import { StocksTable } from './-components/stocks-table';

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
	const { data: stocksData, isLoading } = useGetOwnedStocks();
	const { data: accountsData } = useListAllAccounts(user?.userId || '');

	const accounts = Array.isArray(accountsData) ? accountsData : [];
	const stocks = Array.isArray(stocksData) ? stocksData : [];

	const hasStocks = stocks.length > 0;

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between pt-2">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Stocks</h1>
					<p className="text-muted-foreground">
						Explore stock market data, track your investments, and make informed
						decisions
					</p>
				</div>
				<div className="flex items-center gap-4">
					<CreateStockModal />
					<BuyStockModal accounts={accounts} />
				</div>
			</div>
			{hasStocks ? (
				<Card>
					<CardContent>
						<StocksTable data={stocks} />
					</CardContent>
				</Card>
			) : (
				<Empty>
					<EmptyMedia variant="icon">
						<TrendingUp className="size-10" />
					</EmptyMedia>
					<EmptyTitle>No stocks found</EmptyTitle>
					<EmptyDescription>
						Purchase your first stock to start investing.
					</EmptyDescription>
					<EmptyContent>
						<BuyStockModal accounts={accounts} />
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}

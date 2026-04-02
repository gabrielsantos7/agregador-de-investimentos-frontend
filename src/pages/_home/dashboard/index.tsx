import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import Decimal from 'decimal.js';
import {
	ArrowLeftRight,
	ArrowUpRight,
	BarChart3,
	Landmark,
	PieChart,
	TrendingDown,
	TrendingUp,
	Wallet,
} from 'lucide-react';
import { Loader } from '@/components/shared/loader';
import { StockLogo } from '@/components/shared/stock-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	getGetOwnedStocksQueryOptions,
	useGetOwnedStocks,
} from '@/http/requests/stocks';
import {
	getGetTransactionHistoryQueryOptions,
	useGetTransactionHistory,
} from '@/http/requests/trades';
import {
	getListAllAccountsQueryOptions,
	useListAllAccounts,
} from '@/http/requests/users';
import { TransactionResponseType } from '@/http/schemas';
import { cn } from '@/lib/utils';
import { Route as RootLayout } from '@/pages/_home/layout';
import { formatCurrency } from '@/utils/formatters';
import { MetricCard } from './-components/metric-card';
import { StatPill } from './-components/stat-pill';

export const Route = createFileRoute('/_home/dashboard/')({
	loader: async ({ context: { queryClient }, parentMatchPromise }) => {
		const user = (await parentMatchPromise).loaderData?.user;

		if (!user?.userId) {
			throw new Response('User not found', { status: 404 });
		}

		await Promise.all([
			queryClient.ensureQueryData(getGetOwnedStocksQueryOptions()),
			queryClient.ensureQueryData(getGetTransactionHistoryQueryOptions()),
			queryClient.ensureQueryData(getListAllAccountsQueryOptions(user.userId)),
		]);
	},
	pendingComponent: () => <Loader />,
	head: () => ({
		meta: [{ title: 'Dashboard' }],
	}),
	component: Dashboard,
});

function Dashboard() {
	const { user } = RootLayout.useLoaderData();
	const { data: stocksData, isLoading: isStocksLoading } = useGetOwnedStocks();
	const { data: transactionsData, isLoading: isTransactionsLoading } =
		useGetTransactionHistory();
	const { data: accountsData, isLoading: isAccountsLoading } =
		useListAllAccounts(user.userId || '');

	const stocks = Array.isArray(stocksData) ? stocksData : [];
	const transactions = Array.isArray(transactionsData) ? transactionsData : [];
	const accounts = Array.isArray(accountsData) ? accountsData : [];

	const totalInvested = stocks.reduce(
		(sum, stock) => sum.plus(new Decimal(stock.marketValue)),
		new Decimal(0)
	);
	const totalCost = stocks.reduce(
		(sum, stock) => sum.plus(new Decimal(stock.total)),
		new Decimal(0)
	);
	const totalEquity = totalInvested;
	const totalPnl = totalInvested.minus(totalCost);
	const totalPnlPercent = totalCost.greaterThan(0)
		? totalPnl.div(totalCost).mul(100)
		: new Decimal(0);

	const topHoldings = [...stocks]
		.sort((a, b) => b.marketValue - a.marketValue)
		.slice(0, 5);

	const sectorMap = stocks.reduce<Record<string, Decimal>>((acc, stock) => {
		const sector = stock.sector || 'Other';
		acc[sector] = (acc[sector] || new Decimal(0)).plus(stock.marketValue);
		return acc;
	}, {});

	const sectors = Object.entries(sectorMap)
		.map(([name, value]) => ({
			name,
			value,
			allocation: totalInvested.greaterThan(0)
				? value.div(totalInvested).mul(100)
				: new Decimal(0),
		}))
		.sort((a, b) => b.value.minus(a.value).toNumber())
		.slice(0, 6);

	const recentTransactions = [...transactions]
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		)
		.slice(0, 5);

	const profitableStocks = stocks.filter(
		stock => stock.marketValue - stock.total > 0
	).length;
	const losingStocks = stocks.filter(
		stock => stock.marketValue - stock.total < 0
	).length;
	const totalTransactions = transactions.length;
	const buyTransactions = transactions.filter(
		transaction => transaction.type === TransactionResponseType.BUY
	).length;

	const isLoading =
		isStocksLoading || isTransactionsLoading || isAccountsLoading;
	const hasPortfolioData = stocks.length > 0 || transactions.length > 0;

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
					<p className="text-muted-foreground">
						Track your portfolio health and latest activity in one place.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild variant="outline" size="sm">
						<Link to="/transactions">
							<ArrowLeftRight className="size-4" />
							Transactions
						</Link>
					</Button>
					<Button asChild variant="primary" size="sm">
						<Link to="/stocks">
							<ArrowUpRight className="size-4" />
							Explore stocks
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Total equity"
					value={totalEquity}
					description="Current market value"
					icon={Landmark}
				/>
				<MetricCard
					title="Open accounts"
					value={accounts.length}
					description="Active portfolios"
					icon={Wallet}
				/>
				<MetricCard
					title="Invested in stocks"
					value={totalInvested}
					description={`${stocks.length} holdings`}
					icon={BarChart3}
				/>
				<MetricCard
					title="Unrealized P/L"
					value={totalPnl}
					description={`${totalPnl.greaterThanOrEqualTo(0) ? '+' : ''}${totalPnlPercent.toFixed(2)}% vs. cost basis`}
					icon={totalPnl.greaterThanOrEqualTo(0) ? TrendingUp : TrendingDown}
					isPositive={totalPnl.greaterThanOrEqualTo(0)}
				/>
			</div>

			{hasPortfolioData ? (
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
					<Card className="xl:col-span-2">
						<CardHeader>
							<CardTitle>Top holdings</CardTitle>
							<CardDescription>
								Your biggest positions by market value.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{topHoldings.length > 0 ? (
								topHoldings.map(stock => {
									const allocation = totalInvested.greaterThan(0)
										? new Decimal(stock.marketValue).div(totalInvested).mul(100)
										: new Decimal(0);
									const pnl = new Decimal(stock.marketValue).minus(stock.total);

									return (
										<div key={stock.stockId} className="space-y-2">
											<div className="flex items-center justify-between gap-3">
												<div className="flex items-center gap-2 min-w-0">
													<StockLogo
														src={stock.logoUrl}
														stockId={stock.stockId}
													/>
													<div className="min-w-0">
														<p className="font-medium truncate">
															{stock.stockId}
														</p>
														<p className="text-xs text-muted-foreground truncate">
															{stock.sector || 'Other'}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm font-semibold">
														{formatCurrency(stock.marketValue)}
													</p>
													<p
														className={cn('text-xs', {
															'text-green-600 dark:text-green-400':
																pnl.greaterThanOrEqualTo(0),
															'text-red-600 dark:text-red-400': pnl.lessThan(0),
														})}
													>
														{pnl.greaterThanOrEqualTo(0) ? '+' : ''}
														{formatCurrency(pnl)}
													</p>
												</div>
											</div>
											<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
												<div
													className="h-full rounded-full bg-emerald-500"
													style={{
														width: `${Math.min(allocation.toNumber(), 100)}%`,
													}}
												/>
											</div>
											<p className="text-xs text-muted-foreground">
												{allocation.toFixed(2)}% allocation
											</p>
										</div>
									);
								})
							) : (
								<p className="text-sm text-muted-foreground">
									Your holdings will show up here after your first buy.
								</p>
							)}
						</CardContent>
					</Card>

					<Card className="xl:col-span-3">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Recent transactions</CardTitle>
								<CardDescription>
									Latest buy and sell operations.
								</CardDescription>
							</div>
							<Button asChild variant="ghost" size="sm">
								<Link to="/transactions">View all</Link>
							</Button>
						</CardHeader>
						<CardContent>
							{recentTransactions.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Type</TableHead>
											<TableHead>Stock</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead className="text-right">When</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentTransactions.map(transaction => {
											const isBuy =
												transaction.type === TransactionResponseType.BUY;
											const transactionDate = new Date(transaction.timestamp);

											return (
												<TableRow key={transaction.transactionId}>
													<TableCell>
														<Badge variant={isBuy ? 'success' : 'destructive'}>
															{transaction.type}
														</Badge>
													</TableCell>
													<TableCell>{transaction.stockId}</TableCell>
													<TableCell className="text-right">
														{formatCurrency(transaction.totalValue)}
													</TableCell>
													<TableCell className="text-right text-muted-foreground">
														{formatDistanceToNow(transactionDate, {
															addSuffix: true,
														})}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							) : (
								<p className="text-sm text-muted-foreground">
									Your latest trades will appear here.
								</p>
							)}
						</CardContent>
					</Card>

					<Card className="xl:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<PieChart className="size-4" />
								Sector allocation
							</CardTitle>
							<CardDescription>
								Diversification by market value.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{sectors.length > 0 ? (
								sectors.map(sector => (
									<div key={sector.name} className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="font-medium">{sector.name}</span>
											<span className="text-muted-foreground">
												{sector.allocation.toFixed(2)}%
											</span>
										</div>
										<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
											<div
												className="h-full rounded-full bg-emerald-500"
												style={{
													width: `${Math.min(sector.allocation.toNumber(), 100)}%`,
												}}
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											{formatCurrency(sector.value)}
										</p>
									</div>
								))
							) : (
								<p className="text-sm text-muted-foreground">
									Sector allocation is available after you buy stocks.
								</p>
							)}
						</CardContent>
					</Card>

					<Card className="xl:col-span-3">
						<CardHeader>
							<CardTitle>Performance snapshot</CardTitle>
							<CardDescription>
								Quick pulse on gains, losses and activity.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
							<StatPill
								label="Profitable"
								value={`${profitableStocks}`}
								tone="positive"
							/>
							<StatPill
								label="Losing"
								value={`${losingStocks}`}
								tone="negative"
							/>
							<StatPill
								label="Transactions"
								value={`${totalTransactions}`}
								tone="neutral"
							/>
							<StatPill
								label="Buy Ratio"
								value={`${totalTransactions > 0 ? ((buyTransactions / totalTransactions) * 100).toFixed(1) : '0.0'}%`}
								tone="neutral"
							/>
						</CardContent>
					</Card>
				</div>
			) : (
				<Empty>
					<EmptyMedia variant="icon">
						<BarChart3 className="size-10" />
					</EmptyMedia>
					<EmptyTitle>Your dashboard is ready</EmptyTitle>
					<EmptyDescription>
						Create an account and buy your first stock to populate metrics and
						insights.
					</EmptyDescription>
					<EmptyContent className="flex flex-wrap items-center justify-center gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/accounts">Create account</Link>
						</Button>
						<Button asChild variant="primary" size="sm">
							<Link to="/stocks">Buy first stock</Link>
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}

import { Decimal } from 'decimal.js';
import { Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AccountResponseDto } from '@/http/schemas';
import { formatCurrency } from '@/utils/formatters';

export function AccountCard({ account }: { account: AccountResponseDto }) {
	const totalValue = useMemo(
		() =>
			account.stocks?.reduce((sum, stock) => {
				const stockValue = new Decimal(stock.quantity).mul(
					new Decimal(stock.price)
				);
				return sum.add(stockValue);
			}, new Decimal(0)),
		[account.stocks]
	);

	return (
		<Card
			key={account.accountId}
			className="bg-card border-border hover:border-lime-500 duration-300 transition-colors group"
		>
			<CardHeader className="flex flex-row items-start justify-between pb-2">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-lime-500/10">
						<Wallet className="h-5 w-5 text-primary group-hover:text-lime-500" />
					</div>
					<div>
						<CardTitle className="text-lg text-foreground">
							{account.description}
						</CardTitle>
						<p className="text-xs text-muted-foreground">
							{account.stocks?.length || 0} stocks
						</p>
					</div>
				</div>
				{/* <DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="text-muted-foreground"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="bg-popover border-border">
						<DropdownMenuItem
							onClick={() => {
								// setSelectedAccount(account);
								// setIsDetailDialogOpen(true);
							}}
							className="cursor-pointer"
						>
							<Eye className="mr-2 h-4 w-4" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								// handleDeleteAccount(account.accountId)
							}}
							className="text-destructive focus:text-destructive cursor-pointer"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu> */}
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-end justify-between">
					<div>
						<p className="text-3xl font-bold text-foreground">
							{totalValue
								? formatCurrency(totalValue)
								: formatCurrency(new Decimal(0))}
						</p>
						{/* <div className="flex items-center gap-2 mt-1">
							{account.change >= 0 ? (
								<TrendingUp className="h-4 w-4 text-success" />
							) : (
								<TrendingDown className="h-4 w-4 text-destructive" />
							)}
							<span
								className={`text-sm font-medium ${
									account.change >= 0 ? 'text-success' : 'text-destructive'
								}`}
							>
								{account.change >= 0 ? '+' : ''}
								{account.changePercent.toFixed(2)}%
							</span>
							<span className="text-sm text-muted-foreground">
								(${Math.abs(account.change).toLocaleString()})
							</span>
						</div> */}
					</div>
				</div>

				{/* Stock Holdings Preview */}
				{account.stocks && account.stocks.length > 0 && (
					<div className="space-y-2">
						<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
							Top Holdings
						</p>
						<div className="flex flex-wrap gap-2">
							{account.stocks.slice(0, 4).map(stock => (
								<Badge
									key={stock.stockId}
									variant="secondary"
									className="bg-secondary text-secondary-foreground"
								>
									{stock.stockId}
								</Badge>
							))}
							{account.stocks.length > 4 && (
								<Badge
									variant="secondary"
									className="bg-secondary text-secondary-foreground"
								>
									+{account.stocks.length - 4} more
								</Badge>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

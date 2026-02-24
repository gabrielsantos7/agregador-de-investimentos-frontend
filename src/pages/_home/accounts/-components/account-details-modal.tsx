import Decimal from 'decimal.js';
import { Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { StockLogo } from '@/components/shared/stock-logo';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { AccountResponseDto } from '@/http/schemas';
import { formatCurrency } from '@/utils/formatters';

type AccountDetailsModalProps = {
	account: AccountResponseDto;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function AccountDetailsModal({
	account,
	open,
	onOpenChange,
}: AccountDetailsModalProps) {
	const totalValue = useMemo(
		() =>
			account.stocks?.reduce((sum, stock) => {
				const stockValue = new Decimal(stock.quantity).mul(
					new Decimal(stock.currentPrice)
				);
				return sum.add(stockValue);
			}, new Decimal(0)),
		[account.stocks]
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-card border-border max-w-2xl! max-h-[85vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-foreground flex items-center gap-3">
						<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<Wallet className="size-5 text-primary" />
						</div>
						{account.description}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						Account holdings and performance details
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 min-h-0 overflow-hidden">
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-secondary/50 rounded-lg p-4">
							<p className="text-sm text-muted-foreground">Total Value</p>
							<p className="text-xl font-bold text-foreground">
								{formatCurrency(totalValue || new Decimal(0))}
							</p>
						</div>
						{/* <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p
                    className={`text-xl font-bold ${
                      account.change >= 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {account.change >= 0 ? "+" : ""}$
                    {account.change.toLocaleString()}
                  </p>
                </div> */}
						<div className="bg-secondary/50 rounded-lg p-4">
							<p className="text-sm text-muted-foreground">Stocks</p>
							<p className="text-xl font-bold text-foreground">
								{account.stocks?.length || 0}
							</p>
						</div>
					</div>

					{account.stocks && (
						<div className="bg-secondary/50 rounded-lg">
							{account.stocks.length === 0 ? (
								<p className="p-4 text-sm text-muted-foreground">
									No stocks in this account
								</p>
							) : (
								<div className="overflow-hidden rounded-lg max-h-[45vh] overflow-y-auto">
									<Table className="w-full text-sm">
										<TableHeader className="overflow-hidden">
											<TableRow className="border-b border-border">
												<TableHead className="text-left py-2 px-3 text-muted-foreground font-medium">
													Stock
												</TableHead>
												<TableHead className="text-right py-2 px-3 text-muted-foreground font-medium">
													Quantity
												</TableHead>
												<TableHead className="text-right py-2 px-3 text-muted-foreground font-medium">
													Price
												</TableHead>
												<TableHead className="text-right py-2 px-3 text-muted-foreground font-medium">
													Total
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{account.stocks.map(stock => (
												<TableRow
													key={stock.stockId}
													className="border-b border-border/50 hover:bg-secondary/30"
												>
													<TableCell className="flex items-center gap-3 max-w-xs">
														<StockLogo
															stockId={stock.stockId}
															src={stock.logoUrl}
															alt={`Logo for ${stock.stockId}`}
															size="lg"
														/>
														<div className="min-w-0">
															<p className="text-foreground font-medium truncate">
																{stock.stockId}
															</p>
															<p className="text-muted-foreground text-sm truncate">
																{stock.longName}
															</p>
														</div>
													</TableCell>

													<TableCell className="text-right text-foreground">
														{stock.quantity}
													</TableCell>
													<TableCell className="text-right text-foreground">
														{formatCurrency(new Decimal(stock.currentPrice))}
													</TableCell>
													<TableCell className="text-right text-foreground font-medium">
														{formatCurrency(
															new Decimal(stock.quantity).mul(
																new Decimal(stock.currentPrice)
															)
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</div>
					)}
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

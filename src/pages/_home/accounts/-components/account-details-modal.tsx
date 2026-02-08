import Decimal from 'decimal.js';
import { Wallet } from 'lucide-react';
import { useMemo } from 'react';
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
					new Decimal(stock.price)
				);
				return sum.add(stockValue);
			}, new Decimal(0)),
		[account.stocks]
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-card border-border max-w-2xl">
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

				<div className="space-y-6 py-4">
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
							<p className="text-sm text-muted-foreground">Positions</p>
							<p className="text-xl font-bold text-foreground">
								{account.stocks?.length || 0}
							</p>
						</div>
					</div>
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

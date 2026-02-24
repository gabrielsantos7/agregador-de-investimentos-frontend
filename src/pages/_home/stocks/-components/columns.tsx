import type { ColumnDef } from '@tanstack/react-table';
import Decimal from 'decimal.js';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { StockLogo } from '@/components/shared/stock-logo';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { AccountStockResponseDto } from '@/http/schemas';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

export const columns: ColumnDef<AccountStockResponseDto>[] = [
	{
		accessorKey: 'logoUrl',
		meta: { label: 'Logo' },
		header: () => <>Logo</>,
		cell: ({ row }) => (
			<StockLogo stockId={row.original.stockId} src={row.original.logoUrl} />
		),
	},
	{
		accessorKey: 'stockId',
		meta: { label: 'Stock ID' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Stock ID" />
		),
	},
	{
		accessorKey: 'name',
		meta: { label: 'Name' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
	},
	{
		accessorKey: 'quantity',
		meta: { label: 'Quantity' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Quantity" />
		),
	},
	{
		accessorKey: 'price',
		meta: { label: 'Price' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price" />
		),
		cell: ({ row }) => {
			const price = new Decimal(row.original.currentPrice);
			return <>{formatCurrency(price)}</>;
		},
	},
	{
		accessorKey: 'change',
		meta: { label: 'Change' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Change" />
		),
		cell: ({ row }) => {
			const change = new Decimal(row.original.change);
			const isChangePositive = change.greaterThan(0);

			return (
				<div
					className={cn('flex items-center gap-1', {
						'text-green-600 dark:text-green-400': isChangePositive,
						'text-red-600 dark:text-red-400': !isChangePositive,
					})}
				>
					{change.greaterThan(0) ? (
						<TrendingUp className="size-4" />
					) : (
						<TrendingDown className="size-4" />
					)}
					{change.greaterThan(0) && '+'}
					{change.toFixed(2)}%
				</div>
			);
		},
	},
	{
		accessorKey: 'volume',
		meta: { label: 'Volume' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Volume" />
		),
		cell: ({ row }) => {
			const volume = row.original.volume;
			return (
				<>
					{Intl.NumberFormat('en-US', {
						notation: 'compact',
						maximumFractionDigits: 1,
						compactDisplay: 'short',
					}).format(volume)}
				</>
			);
		},
	},
	{
		accessorKey: 'total',
		meta: { label: 'Total value' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total value" />
		),
		cell: ({ row }) => {
			const total = new Decimal(row.original.total);
			return <>{formatCurrency(total)}</>;
		},
	},
];

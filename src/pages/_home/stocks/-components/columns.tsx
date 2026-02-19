import type { ColumnDef } from '@tanstack/react-table';
import Decimal from 'decimal.js';
import { StockLogo } from '@/components/shared/stock-logo';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { AccountStockResponseDto } from '@/http/schemas';
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
			const price = new Decimal(row.original.price);
			return <>{formatCurrency(price)}</>;
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

import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import Decimal from 'decimal.js';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	type TransactionResponse,
	TransactionResponseType,
} from '@/http/schemas';
import { formatCurrency } from '@/utils/formatters';

export const columns: ColumnDef<TransactionResponse>[] = [
	{
		accessorKey: 'timestamp',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row }) => {
			const date = new Date(row.original.timestamp);
			const formattedDate = formatDistanceToNow(date, { addSuffix: true });
			const fullDate = format(date, 'MMM d, yyyy, H:mm:ss');

			return (
				<Tooltip>
					<TooltipTrigger>{formattedDate}</TooltipTrigger>
					<TooltipContent>
						<p>{fullDate}</p>
					</TooltipContent>
				</Tooltip>
			);
		},
	},
	{
		accessorKey: 'stockId',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Stock" />
		),
	},
	{
		accessorKey: 'type',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Type" />
		),
		cell: ({ row }) => {
			const type = row.original.type;
			const isBuy = type === TransactionResponseType.BUY;

			return (
				<Badge variant={isBuy ? 'success' : 'destructive'}>
					{type === TransactionResponseType.BUY ? (
						<ShoppingCart className="mr-1.5 size-3" />
					) : (
						<DollarSign className="mr-1.5 size-3" />
					)}
					{type.toLowerCase()}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Quantity" />
		),
	},
	{
		accessorKey: 'priceAtTime',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price at time" />
		),
		cell: ({ row }) => {
			const price = new Decimal(row.original.priceAtTime);

			return formatCurrency(price);
		},
	},
	{
		accessorKey: 'totalValue',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total value" />
		),
		cell: ({ row }) => {
			const totalValue = new Decimal(row.original.totalValue);
			return formatCurrency(totalValue);
		},
	},
];

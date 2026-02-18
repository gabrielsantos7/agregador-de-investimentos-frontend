import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { Stock } from '@/http/schemas';

export const columns: ColumnDef<Stock>[] = [
	{
		accessorKey: 'stockId',
		meta: { label: 'Stock ID' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Stock ID" />
		),
	},
	{
		accessorKey: 'totalQuantity',
		meta: { label: 'Quantity' },
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Quantity" />
		),
	},
];

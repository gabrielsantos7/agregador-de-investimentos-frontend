import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { Stock } from '@/http/schemas';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: 'stockId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock ID" />
    )
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    )
  }
];

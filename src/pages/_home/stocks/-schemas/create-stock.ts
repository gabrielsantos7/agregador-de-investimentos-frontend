import { z } from 'zod';

export const createStockSchema = z.object({
	stockId: z
		.string()
		.min(4, 'Stock ID must be at least 4 characters')
		.max(10, 'Stock ID must be at most 10 characters'),
	description: z.string().min(1, 'Description is required'),
});

export type CreateStockSchema = z.infer<typeof createStockSchema>;

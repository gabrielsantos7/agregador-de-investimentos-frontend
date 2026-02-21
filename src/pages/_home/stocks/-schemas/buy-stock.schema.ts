import { z } from 'zod';

export const buyStockSchema = z.object({
	stockId: z
		.string()
		.check(z.trim(), z.toUpperCase())
		.min(1, 'Stock ID is required'),
	quantity: z.number().int().positive('Quantity must be a positive integer'),
	accountId: z.uuid('Please select a valid account'),
});

export type BuyStockSchema = z.infer<typeof buyStockSchema>;

import { z } from 'zod';

export const buyStockSchema = z.object({
	stockId: z.string().min(1, 'Stock ID is required'),
	quantity: z.number().int().positive('Quantity must be a positive integer'),
	accountId: z.uuid('Account ID must be a valid UUID'),
});

export type BuyStockSchema = z.infer<typeof buyStockSchema>;

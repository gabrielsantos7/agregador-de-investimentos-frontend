import { z } from 'zod';

export const createAccountSchema = z.object({
	description: z.string().min(1, 'Account description is required'),
	street: z.string().min(1, 'Street is required'),
	number: z.string().min(1, 'Number is required'),
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

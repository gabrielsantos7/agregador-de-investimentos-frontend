import { z } from 'zod';

export const registerSchema = z
	.object({
		username: z.string().min(3, 'Username must be at least 3 characters'),
		email: z.email('Please enter a valid email address'),
		password: z
			.string()
			.min(8, { message: 'It must be at least 8 characters long.' })
			.max(100, { message: 'It must not exceed 100 characters.' })
			.regex(/[A-Z]/, {
				message: 'It must contain at least one uppercase letter.',
			})
			.regex(/[a-z]/, {
				message: 'It must contain at least one lowercase letter.',
			})
			.regex(/[0-9]/, {
				message: 'It must contain at least one number.',
			})
			.regex(/[^a-zA-Z0-9]/, {
				message: 'It must contain at least one special character.',
			}),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		role: z.enum(['ADMIN']),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'The passwords do not match.',
		path: ['confirmPassword'],
	});

export type RegisterSchema = z.infer<typeof registerSchema>;

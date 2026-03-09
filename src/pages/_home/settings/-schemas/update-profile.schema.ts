import { z } from 'zod';
import {
	baseRegisterSchema,
	registerSchema,
} from '@/pages/_auth/register/-schemas/register.schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

export const updateProfileSchema = baseRegisterSchema
	.pick({
		username: true,
		password: true,
		confirmPassword: true,
	})
	.extend({
		password: registerSchema.shape.password.optional(),
		confirmPassword: z.string().optional(),
		avatar: z
			.instanceof(File)
			.refine(
				file => file.size <= MAX_FILE_SIZE,
				'The file size should be less than 5MB.'
			)
			.refine(
				file => ACCEPTED_IMAGE_TYPES.includes(file.type),
				'Only .jpg, .jpeg, .png and .webp files are allowed.'
			)
			.optional(),
	})
	.refine(data => !data.password || !!data.confirmPassword, {
		message: 'Please confirm your password',
		path: ['confirmPassword'],
	})
	.refine(data => !data.password || data.password === data.confirmPassword, {
		message: 'The passwords do not match.',
		path: ['confirmPassword'],
	});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

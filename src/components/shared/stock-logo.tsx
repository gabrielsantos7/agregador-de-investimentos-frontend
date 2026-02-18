import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const stockLogoVariants = cva('rounded-full object-cover', {
	variants: {
		size: {
			default: 'size-6',
			sm: 'size-4',
			lg: 'size-8',
		},
	},
});

interface StockLogoProps
	extends ComponentProps<'img'>,
		VariantProps<typeof stockLogoVariants> {
	stockId: string;
}

export function StockLogo({ src, stockId, size = 'default' }: StockLogoProps) {
	return (
		<img src={src} alt={stockId} className={stockLogoVariants({ size })} />
	);
}

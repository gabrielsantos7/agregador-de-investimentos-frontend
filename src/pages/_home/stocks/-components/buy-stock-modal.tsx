import { useForm } from '@tanstack/react-form';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { ApiError } from '@/http/errors/api-error';
import { useBuyStock } from '@/http/requests/trades';
import type { AccountResponseDto } from '@/http/schemas';
import { type BuyStockSchema, buyStockSchema } from '../-schemas/buy-stock';

const formDefaultValues: BuyStockSchema = {
	stockId: '',
	quantity: 1,
	accountId: '',
};

export function BuyStockModal({
	accounts,
}: {
	accounts: AccountResponseDto[];
}) {
	const { mutate: buyStock, isPending: isBuyingStock } = useBuyStock<ApiError>({
		mutation: {
			onSuccess: () => {
				toast.success('Stock bought successfully');
				// TODO: invalidate stocks query
			},
			onError: error => {
				const description = error.message || 'An unexpected error occurred';
				toast.error('Error buying stock', { description });
			},
		},
	});

	const form = useForm({
		defaultValues: formDefaultValues,
		validators: {
			onSubmit: buyStockSchema,
		},
		onSubmit: ({ value }) => {
			console.log('Buying stock with value:', value);
			buyStock({
				data: {
					...value,
				},
			});
		},
	});

	return (
		<Dialog>
			<form
				id="buy-stock-form"
				onSubmit={e => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<DialogTrigger asChild>
					<Button variant="primary">Buy stock</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Buy stock</DialogTitle>
						<DialogDescription>
							Buy a stock to add it to your portfolio.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<form.Field name="accountId">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Account</FieldLabel>
										<Select
											value={field.state.value}
											onValueChange={field.handleChange}
											disabled={isBuyingStock}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select an account" />
											</SelectTrigger>
											<SelectContent>
												{accounts.map((account: AccountResponseDto) => (
													<SelectItem
														key={account.accountId}
														value={account.accountId}
													>
														{account.description}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="stockId">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Stock</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="AAPL"
											disabled={isBuyingStock}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="quantity">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
										<Input
											id={field.name}
											type="number"
											step={1}
											min={1}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(Number(e.target.value))}
											placeholder="67"
											disabled={isBuyingStock}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" disabled={isBuyingStock}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							variant="primary"
							form="buy-stock-form"
							className="w-34"
							disabled={isBuyingStock}
						>
							{isBuyingStock ? (
								<LoaderCircle className="animate-spin size-6" strokeWidth={3} />
							) : (
								'Save changes'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}

import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
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
import { getGetOwnedStocksQueryKey } from '@/http/requests/stocks';
import {
	getGetTransactionHistoryQueryKey,
	useBuyStock,
} from '@/http/requests/trades';
import { getListAllAccountsQueryKey } from '@/http/requests/users';
import type { AccountResponseDto, ErrorResponseDto } from '@/http/schemas';
import { useAuth } from '@/integrations/tanstack-store/stores/auth.store';
import {
	type BuyStockSchema,
	buyStockSchema,
} from '../-schemas/buy-stock.schema';

const formDefaultValues: BuyStockSchema = {
	stockId: '',
	quantity: 1,
	accountId: '',
};

interface BuyStockModalProps {
	accounts: AccountResponseDto[];
	defaultAccountId?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: ReactNode;
}

export function BuyStockModal({
	accounts,
	defaultAccountId,
	open: controlledOpen,
	onOpenChange,
	trigger,
}: BuyStockModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const userId = user?.userId;

	const { mutate: buyStock, isPending: isBuyingStock } =
		useBuyStock<ErrorResponseDto>({
			mutation: {
				onSuccess: () => {
					toast.success('Stock bought successfully');
					form.reset();
					handleOpenChange(false);

					queryClient.invalidateQueries({
						queryKey: getGetOwnedStocksQueryKey(),
					});

					if (userId) {
						queryClient.invalidateQueries({
							queryKey: getListAllAccountsQueryKey(userId),
						});
					}

					queryClient.invalidateQueries({
						queryKey: getGetTransactionHistoryQueryKey(),
					});
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
			const parsed = buyStockSchema.safeParse(value).data as BuyStockSchema;
			buyStock({
				data: {
					...parsed,
				},
			});
		},
	});

	const handleOpenChange = (isOpen: boolean) => {
		if (!isControlled) {
			setInternalOpen(isOpen);
		}

		onOpenChange?.(isOpen);

		if (!isOpen) {
			form.reset();
		}
	};

	useEffect(() => {
		if (open && defaultAccountId) {
			form.setFieldValue('accountId', defaultAccountId);
		}
	}, [defaultAccountId, form, open]);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{trigger ? (
				<DialogTrigger asChild>{trigger}</DialogTrigger>
			) : !isControlled ? (
				<DialogTrigger asChild>
					<Button variant="primary">Buy stock</Button>
				</DialogTrigger>
			) : null}
			<DialogContent className="sm:max-w-sm">
				<form
					id="buy-stock-form"
					onSubmit={e => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Buy stock</DialogTitle>
						<DialogDescription>
							Buy a stock to add it to your portfolio.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="gap-4 mt-2">
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
					<DialogFooter className="mt-2">
						<DialogClose asChild>
							<Button variant="outline" disabled={isBuyingStock}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							variant="primary"
							className="wfull sm:w-34 font-medium"
							disabled={isBuyingStock}
						>
							{isBuyingStock ? (
								<LoaderCircle className="animate-spin size-6" strokeWidth={3} />
							) : (
								'Save changes'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

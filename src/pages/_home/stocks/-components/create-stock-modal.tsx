import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
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
import type { ApiError } from '@/http/errors/api-error';
import {
	getGetOwnedStocksQueryKey,
	useCreateStock,
} from '@/http/requests/stocks';
import {
	type CreateStockSchema,
	createStockSchema,
} from '../-schemas/create-stock';

const defaultValues: CreateStockSchema = {
	stockId: '',
	description: '',
};

export function CreateStockModal() {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { mutate: createStock, isPending: isCreatingStock } =
		useCreateStock<ApiError>({
			mutation: {
				onSuccess: () => {
					toast.success('Stock created successfully');
					form.reset();
					setOpen(false);
					queryClient.invalidateQueries({
						queryKey: getGetOwnedStocksQueryKey(),
					});
				},
				onError: error => {
					const errorMessage = error.message || 'An unexpected error occurred';
					toast.error('Error creating stock', {
						description: errorMessage,
					});
				},
			},
		});

	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onSubmit: createStockSchema,
		},
		onSubmit: ({ value }) => {
			createStock({
				data: {
					...value,
				},
			});
		},
	});

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);

		if (!isOpen) {
			form.reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<form
				id="create-stock-form"
				onSubmit={event => {
					event.preventDefault();
					form.handleSubmit();
				}}
			>
				<DialogTrigger asChild>
					<Button variant="outline">Create stock</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Create stock</DialogTitle>
						<DialogDescription>
							Register a new stock so it can be traded.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<form.Field name="stockId">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Stock ID</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={event => field.handleChange(event.target.value)}
											placeholder="PETR4"
											disabled={isCreatingStock}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="description">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Description</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={event => field.handleChange(event.target.value)}
											placeholder="Petróleo Brasileiro S.A."
											disabled={isCreatingStock}
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
							<Button variant="outline" disabled={isCreatingStock}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							variant="primary"
							form="create-stock-form"
							className="w-full sm:w-34 font-medium"
							disabled={isCreatingStock}
						>
							{isCreatingStock ? (
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

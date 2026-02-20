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
	getListAllAccountsQueryKey,
	useCreateAccount,
} from '@/http/requests/users';
import { useAuth } from '@/integrations/tanstack-store/stores/auth.store';
import {
	type CreateAccountSchema,
	createAccountSchema,
} from '../-schemas/create-account.schema';

const formDefaultValues: CreateAccountSchema = {
	description: '',
	number: '',
	street: '',
};

export function CreateAccountModal() {
	const [open, setOpen] = useState(false);
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const userId = user?.userId;

	const { mutate: createAccount, isPending: isCreatingAccount } =
		useCreateAccount<ApiError>({
			mutation: {
				onSuccess: () => {
					toast.success('Account created successfully');
					if (userId) {
						queryClient.invalidateQueries({
							queryKey: getListAllAccountsQueryKey(userId),
						});
					}
					form.reset();
					setOpen(false);
				},
				onError: error => {
					const description = error.message || 'An unexpected error occurred';
					toast.error('Error creating account', { description });
				},
			},
		});

	const form = useForm({
		defaultValues: formDefaultValues,
		validators: {
			onSubmit: createAccountSchema,
		},
		onSubmit: ({ value }) => {
			if (!userId) {
				toast.error('Error creating account', {
					description: 'You must be logged in to create an account',
				});
				return;
			}

			createAccount({
				userId,
				data: {
					...value,
					number: Number(value.number),
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
				id="create-account-form"
				onSubmit={e => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<DialogTrigger asChild>
					<Button variant="primary">Create account</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Create account</DialogTitle>
						<DialogDescription>
							Create a new account to start managing your finances.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
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
											onChange={e => field.handleChange(e.target.value)}
											placeholder="personal account"
											disabled={isCreatingAccount}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="street">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Street</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="main St"
											disabled={isCreatingAccount}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="number">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Number</FieldLabel>
										<Input
											id={field.name}
											type="number"
											step={1}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="67"
											disabled={isCreatingAccount}
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
							<Button variant="outline" disabled={isCreatingAccount}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							variant="primary"
							form="create-account-form"
							className="w-full sm:w-34 font-medium"
							disabled={isCreatingAccount}
						>
							{isCreatingAccount ? (
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

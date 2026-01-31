import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import type { ApiError } from '@/http/errors/api-error';
import { useRegister } from '@/http/requests/authentication';
import { setAuthData } from '@/integrations/tanstack-store/stores/auth.store';
import { redirectSchema } from '@/schemas/redirect.schema';
import {
	type RegisterSchema,
	registerSchema,
} from './-schemas/register.schema';

export const Route = createFileRoute('/_auth/register/')({
	component: Register,
	head: () => ({
		meta: [{ title: 'Register' }],
	}),
	validateSearch: redirectSchema.parse,
});

const formDefaultValues: RegisterSchema = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
	role: 'ADMIN',
};

function Register() {
	const navigate = useNavigate();
	const { redirect = '/' } = Route.useSearch();

	const { mutate: register, isPending: isRegistering } = useRegister<ApiError>({
		mutation: {
			onSuccess: ({ user, accessToken }) => {
				toast.success('Success', {
					description: 'Your account has been created.',
				});
				setAuthData(user, accessToken);
				navigate({ to: redirect });
			},
			onError: error => {
				const description = error.message || 'An unexpected error occurred';
				toast.error('Registration failed', { description });
			},
		},
	});

	const form = useForm({
		defaultValues: formDefaultValues,
		validators: {
			onSubmit: registerSchema,
		},
		onSubmit: async ({ value }) => {
			register({ data: value });
		},
	});

	return (
		<Card className="w-full md:w-108">
			<CardHeader>
				<CardTitle className="text-2xl">Register</CardTitle>
				<CardDescription>
					Create a new account to start managing your investments.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="register-form"
					onSubmit={e => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					<FieldGroup className="gap-4">
						<form.Field name="username">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Username</FieldLabel>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="johndoe"
											disabled={isRegistering}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="email">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											type="email"
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="john@example.com"
											disabled={isRegistering}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="password">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<PasswordInput
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="••••••••"
											disabled={isRegistering}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="confirmPassword">
							{field => {
								const isInvalid =
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0;
								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Confirm Password
										</FieldLabel>
										<PasswordInput
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="••••••••"
											disabled={isRegistering}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>

					<Button
						type="submit"
						variant="primary"
						className="w-full"
						disabled={isRegistering}
					>
						{isRegistering ? (
							<LoaderCircle className="animate-spin size-6" strokeWidth={3} />
						) : (
							'Register'
						)}
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Already have an account?{' '}
					<Link
						to="/login"
						search={{ redirect }}
						className="text-emerald-400 hover:underline"
					>
						Login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}

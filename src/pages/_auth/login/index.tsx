import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { StatusCodes } from 'http-status-codes';
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
import { useLogin } from '@/http/requests/authentication';
import { setAuthData } from '@/integrations/tanstack-store/stores/auth.store';
import { type LoginSchema, loginSchema } from './-schemas/login.schema';
import { redirectSchema } from '../../../schemas/redirect.schema';

export const Route = createFileRoute('/_auth/login/')({
	component: Login,
	head: () => ({
		meta: [{ title: 'Login' }],
	}),
	validateSearch: redirectSchema.parse,
});

const formDefaultValues = {
	username: '',
	password: '',
} satisfies LoginSchema;

function Login() {
	const navigate = useNavigate({ from: '/login/' });
	const { redirect = '/' } = Route.useSearch();

	const { mutate: login, isPending: isLoggingIn } = useLogin<ApiError>({
		mutation: {
			onSuccess: ({ user, accessToken }) => {
				toast.success('Success', {
					description: `Welcome back, ${user.username}.`,
				});
				setAuthData(user, accessToken);
				navigate({ to: redirect || '/' });
			},
			onError: error => {
				let description = 'An unexpected error occurred';

				if (error.status === StatusCodes.UNAUTHORIZED) {
					description = 'Invalid username or password.';
				}

				toast.error('Login failed', {
					description,
				});
			},
		},
	});

	const form = useForm({
		defaultValues: formDefaultValues,
		validators: {
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value }) => {
			login({ data: value });
		},
	});

	return (
		<Card className="w-full md:w-108 ">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your username and password to login to your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id="login-form"
					onSubmit={e => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					<FieldGroup className="gap-4">
						<form.Field
							name="username"
							// biome-ignore lint/correctness/noChildrenProp: <defined prop>
							children={field => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Username</FieldLabel>
										<Input
											type="text"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="johndoe"
											autoComplete="username"
											disabled={isLoggingIn}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="password"
							// biome-ignore lint/correctness/noChildrenProp: <defined prop>
							children={field => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field className="grid gap-2" data-invalid={isInvalid}>
										<div className="flex justify-between items-center">
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										</div>
										<PasswordInput
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="enter your password here..."
											autoComplete="current-password"
											disabled={isLoggingIn}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<Button
						type="submit"
						variant="primary"
						className="w-full"
						disabled={isLoggingIn}
					>
						{isLoggingIn ? (
							<LoaderCircle className="animate-spin size-6" strokeWidth={3} />
						) : (
							'Login'
						)}
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Don&apos;t have an account?{' '}
					<Link
						to="/register"
						className="text-lime-400 hover:underline"
						search={{
							redirect,
						}}
					>
						Register
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}

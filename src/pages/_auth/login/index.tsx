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
import logo from '/logo.png';
import { redirectSchema } from '../../../schemas/redirect.schema';
import { type LoginSchema, loginSchema } from './-schemas/login.schema';

interface Metric {
	id: number;
	value: string;
	label: string;
}

const metrics: Metric[] = [
	{
		id: 1,
		value: '100%',
		label: 'Free to use',
	},
	{
		id: 2,
		value: 'Infinite',
		label: 'Accounts',
	},
	{
		id: 3,
		value: '99.9%',
		label: 'Uptime',
	},
];

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
		<div className="h-dvh w-full flex">
			<div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
				<div className="relative z-10 flex flex-col justify-between p-12 w-full">
					<div className="flex items-center gap-4">
						<img src={logo} alt="Logo" className="size-20" />
						<span className="text-3xl font-bold text-foreground">
							StockFlow
						</span>
					</div>

					<div className="space-y-6 max-w-md">
						<h1 className="text-4xl font-bold leading-tight text-balance text-emerald-400">
							Manage your investments with confidence
						</h1>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Real-time portfolio tracking, advanced analytics, and seamless
							stock management all in one powerful platform.
						</p>
					</div>

					<div className="grid grid-cols-3 gap-4">
						{metrics.map(metric => (
							<Card key={metric.id} className="bg-muted">
								<CardHeader>
									<CardTitle className="text-xl">{metric.value}</CardTitle>
									<CardDescription>{metric.label}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</div>
			<div className="flex-1 flex items-center justify-center px-4 md:px-0">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl">Welcome back!</CardTitle>
						<CardDescription>
							Enter your credentials to access your portfolio
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
													placeholder="your password..."
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
									<LoaderCircle
										className="animate-spin size-6"
										strokeWidth={3}
									/>
								) : (
									'Login'
								)}
							</Button>
						</form>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{' '}
							<Link
								to="/register"
								className="text-emerald-400 hover:underline"
								search={{
									redirect,
								}}
							>
								Register
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

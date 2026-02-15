import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { BarChart3, Check, LoaderCircle, Shield, Zap } from 'lucide-react';
import type { ComponentType } from 'react';
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
import logo from '/logo.png';
import {
	type RegisterSchema,
	registerSchema,
} from './-schemas/register.schema';

interface Feature {
	id: number;
	icon: ComponentType<{ className?: string }>;
	title: string;
	description: string;
}

const features: Feature[] = [
	{
		id: 1,
		icon: BarChart3,
		title: 'Real-time Analytics',
		description: 'Track your portfolio performance with live data',
	},
	{
		id: 2,
		icon: Shield,
		title: 'Bank-level Security',
		description: 'Your data is protected with enterprise encryption',
	},
	{
		id: 3,
		icon: Zap,
		title: 'Instant Execution',
		description: 'Execute trades and updates in milliseconds',
	},
];

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
		onSubmit: ({ value }) => {
			register({ data: value });
		},
	});

	return (
		<div className="h-dvh w-full flex">
			<div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
				<div className="relative z-10 flex flex-col justify-between p-12 w-full">
					<div className="flex items-center gap-4">
						<img src={logo} alt="Logo" className="size-20" />
						<span className="text-3xl font-bold text-foreground">
							StockFlow
						</span>
					</div>

					<div className="space-y-8">
						<div className="space-y-4">
							<h1 className="text-4xl font-bold leading-tight text-balance text-emerald-400">
								Start building your portfolio today
							</h1>
							<p className="text-lg text-muted-foreground leading-relaxed max-w-md">
								Join thousands of investors who trust StockFlow to manage their
								investments.
							</p>
						</div>

						<div className="space-y-4">
							{features.map(feature => (
								<div key={feature.id} className="flex items-start gap-4">
									<div className="size-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
										<feature.icon className="size-5 text-emerald-400" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">
											{feature.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex items-center gap-3 text-sm text-muted-foreground">
						<Check className="size-4 text-emerald-400" />
						<span>Always free</span>
						<span className="text-border">|</span>
						<Check className="size-4 text-emerald-400" />
						<span>No credit card required</span>
					</div>
				</div>
			</div>
			<div className="flex-1 h-dvh overflow-y-auto">
				<div className="min-h-dvh flex items-center justify-center md:py-6 px-4 md:px-0">
					<Card className="w-full max-w-md">
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
										<LoaderCircle
											className="animate-spin size-6"
											strokeWidth={3}
										/>
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
				</div>
			</div>
		</div>
	);
}

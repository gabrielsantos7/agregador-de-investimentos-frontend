import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Pencil, Trash2, Upload, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { getMeQueryKey } from '@/http/requests/authentication';
import {
	getGetUserByIdQueryKey,
	useDeleteUserAvatar,
	useUpdateUserById,
	useUploadUserAvatar,
} from '@/http/requests/users';
import type { ErrorResponseDto } from '@/http/schemas';
import { useAuth } from '@/integrations/tanstack-store/stores/auth.store';
import {
	type UpdateProfileSchema,
	updateProfileSchema,
} from '../-schemas/update-profile.schema';

export function UpdateProfileCard() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

	const userId = user?.userId ?? '';

	const { mutateAsync: updateUserById, isPending: isUpdatingUser } =
		useUpdateUserById<ErrorResponseDto>();

	const { mutateAsync: uploadUserAvatar, isPending: isUploadingAvatar } =
		useUploadUserAvatar<Blob>();

	const { mutateAsync: deleteUserAvatar, isPending: isDeletingAvatar } =
		useDeleteUserAvatar<Blob>();

	const isSubmitting = isUpdatingUser || isUploadingAvatar || isDeletingAvatar;

	const formDefaultValues: UpdateProfileSchema = {
		username: user?.username ?? '',
		password: undefined,
		confirmPassword: undefined,
		avatar: undefined,
	};

	const form = useForm({
		defaultValues: formDefaultValues,
		validators: {
			onSubmit: updateProfileSchema,
		},
		onSubmit: async ({ value }) => {
			if (!userId) {
				toast.error('Error updating profile', {
					description: 'You must be logged in to update your profile.',
				});
				return;
			}

			const username = value.username.trim();
			const hasUsernameChange = username !== (user?.username ?? '').trim();
			const hasPasswordChange = Boolean(value.password);
			const hasAvatarChange = Boolean(value.avatar);

			if (!hasUsernameChange && !hasPasswordChange && !hasAvatarChange) {
				toast.message('No changes to save');
				return;
			}

			try {
				const requests: Promise<unknown>[] = [];

				if (hasUsernameChange || hasPasswordChange) {
					requests.push(
						updateUserById({
							userId,
							data: {
								username,
								...(value.password ? { password: value.password } : {}),
							},
						})
					);
				}

				if (hasAvatarChange && value.avatar) {
					requests.push(
						uploadUserAvatar({
							userId,
							data: { file: value.avatar },
						})
					);
				}

				await Promise.all(requests);

				await Promise.all([
					queryClient.refetchQueries({ queryKey: getMeQueryKey() }),
					queryClient.refetchQueries({
						queryKey: getGetUserByIdQueryKey(userId),
					}),
				]);

				toast.success('Profile updated successfully');

				form.reset({
					username,
					password: undefined,
					confirmPassword: undefined,
					avatar: undefined,
				});
				setAvatarPreviewUrl(null);

				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			} catch (error) {
				const description =
					error instanceof Error
						? error.message
						: 'An unexpected error occurred while updating your profile.';
				toast.error('Error updating profile', { description });
			}
		},
	});

	useEffect(() => {
		return () => {
			if (avatarPreviewUrl) {
				URL.revokeObjectURL(avatarPreviewUrl);
			}
		};
	}, [avatarPreviewUrl]);

	const avatarSrc = avatarPreviewUrl || user?.avatarUrl;
	const hasPersistedAvatar = Boolean(user?.avatarUrl);

	const handleAvatarFileChange = (file?: File) => {
		form.setFieldValue('avatar', file);

		if (!file) {
			if (avatarPreviewUrl) {
				URL.revokeObjectURL(avatarPreviewUrl);
			}
			setAvatarPreviewUrl(null);
			return;
		}

		if (avatarPreviewUrl) {
			URL.revokeObjectURL(avatarPreviewUrl);
		}

		setAvatarPreviewUrl(URL.createObjectURL(file));
	};

	const handleRemoveAvatar = async () => {
		if (!userId || !hasPersistedAvatar) {
			return;
		}

		try {
			await deleteUserAvatar({ userId });

			await Promise.all([
				queryClient.refetchQueries({ queryKey: getMeQueryKey() }),
				queryClient.refetchQueries({
					queryKey: getGetUserByIdQueryKey(userId),
				}),
			]);

			handleAvatarFileChange(undefined);

			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}

			toast.success('Profile photo removed successfully');
		} catch (error) {
			const description =
				error instanceof Error
					? error.message
					: 'An unexpected error occurred while removing your profile photo.';
			toast.error('Error removing profile photo', { description });
		}
	};

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
						<User className="size-5 text-emerald-500" />
					</div>
					<div>
						<CardTitle className="text-foreground">Profile</CardTitle>
						<CardDescription className="text-muted-foreground">
							Update your personal information
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form
					id="update-profile-form"
					onSubmit={e => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					<form.Field name="avatar">
						{field => {
							const isInvalid =
								field.state.meta.isTouched &&
								field.state.meta.errors.length > 0;

							return (
								<Field data-invalid={isInvalid}>
									<div className="flex items-center justify-center">
										<input
											ref={fileInputRef}
											id={field.name}
											type="file"
											accept="image/jpeg,image/jpg,image/png,image/webp"
											className="hidden"
											onBlur={field.handleBlur}
											onChange={e =>
												handleAvatarFileChange(e.target.files?.[0])
											}
											disabled={isSubmitting}
										/>

										<div className="flex items-end">
											<Avatar
												key={avatarSrc ?? 'fallback'}
												className="size-24 sm:size-28 border-3 border-border"
											>
												{avatarSrc && (
													<AvatarImage
														src={avatarSrc}
														alt={user?.username || 'User'}
													/>
												)}

												<AvatarFallback className="text-4xl bg-primary/10 text-primary">
													{user?.username?.charAt(0).toUpperCase() || 'U'}
												</AvatarFallback>
											</Avatar>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="outline"
														size="icon"
														className="size-8 rounded-full"
														disabled={isSubmitting}
													>
														<Pencil className="size-4" />
														<span className="sr-only">Edit photo</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => fileInputRef.current?.click()}
														disabled={isSubmitting}
														className="cursor-pointer"
													>
														<Upload className="mr-2 size-4" />
														Upload photo
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={handleRemoveAvatar}
														disabled={!hasPersistedAvatar || isSubmitting}
														className="text-destructive cursor-pointer focus:text-destructive"
													>
														<Trash2 className="mr-2 size-4" />
														Remove photo
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>

									<p className="text-xs text-muted-foreground text-center">
										JPG, PNG or WEBP. Max size 5MB.
									</p>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

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
											disabled={isSubmitting}
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
										<FieldLabel htmlFor={field.name}>New password</FieldLabel>
										<PasswordInput
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="••••••••"
											disabled={isSubmitting}
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
											Confirm password
										</FieldLabel>
										<PasswordInput
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											placeholder="••••••••"
											disabled={isSubmitting}
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
						className="w-full sm:w-36"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<LoaderCircle className="animate-spin size-6" strokeWidth={3} />
						) : (
							'Save changes'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

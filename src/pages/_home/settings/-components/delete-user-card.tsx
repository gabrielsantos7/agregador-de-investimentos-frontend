import { useNavigate } from '@tanstack/react-router';
import { AlertTriangleIcon, LoaderCircle } from 'lucide-react';
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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useDeleteUser } from '@/http/requests/users';
import {
	logout,
	useAuth,
} from '@/integrations/tanstack-store/stores/auth.store';

export function DeleteUserCard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const userId = user?.userId;

	const { mutate: deleteUserMutate, isPending: isDeleteUserPending } =
		useDeleteUser({
			mutation: {
				onSuccess: () => {
					logout();
					navigate({
						to: '/login',
						replace: true,
					});
					toast.success(
						"Your account has been deleted. We're sorry to see you go!"
					);
				},
				onError: error => {
					const description =
						error.message ||
						'An unexpected error occurred while deleting your account';
					toast.error('Error deleting account', {
						description,
					});
				},
			},
		});

	const handleDeleteUser = () => {
		if (!userId) {
			toast.error('Error deleting account', {
				description: 'You must be logged in to delete your account.',
			});
			return;
		}

		deleteUserMutate({ userId });
	};

	return (
		<Card className="bg-card border-border">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center">
						<AlertTriangleIcon className="size-5 text-red-500" />
					</div>
					<div>
						<CardTitle className="text-foreground">Delete user</CardTitle>
						<CardDescription className="text-muted-foreground">
							This action is irreversible. All your data will be permanently
							deleted.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							type="button"
							variant="destructive"
							className="w-full sm:w-auto"
							disabled={isDeleteUserPending || !userId}
						>
							Delete account
						</Button>
					</DialogTrigger>

					<DialogContent className="sm:max-w-md" showCloseButton={false}>
						<DialogHeader>
							<DialogTitle>Delete account?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. Your account and all associated
								data will be permanently removed.
							</DialogDescription>
						</DialogHeader>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" disabled={isDeleteUserPending}>
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="button"
								variant="destructive"
								onClick={handleDeleteUser}
								disabled={isDeleteUserPending || !userId}
								className="md:w-48"
							>
								{isDeleteUserPending ? (
									<LoaderCircle className="animate-spin size-5" />
								) : (
									'Delete permanently'
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}

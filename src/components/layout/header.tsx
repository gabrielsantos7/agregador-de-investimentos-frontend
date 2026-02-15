import { useLocation, useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useLogout } from '@/http/requests/authentication';
import {
	logout,
	useAuth,
} from '@/integrations/tanstack-store/stores/auth.store';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Header() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const { mutate, isPending } = useLogout({
		mutation: {
			onSuccess: () => {
				logout();
				navigate({
					to: '/login',
					replace: true,
					search: { redirect: location.href },
				});
				toast.success('You have been logged out successfully.');
			},
		},
	});

	return (
		<div className="flex items-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative size-9 rounded-full">
						<Avatar className="size-9">
							<AvatarFallback className="bg-emerald-500/10 text-emerald-400">
								{user?.username?.charAt(0).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-56 bg-popover border-border"
					align="end"
				>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium text-foreground">
								@{user?.username || 'User'}
							</p>
							<p className="text-xs text-muted-foreground">
								{user?.email || 'user@example.com'}
							</p>
						</div>
					</DropdownMenuLabel>
					{/* <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link> */}
					{/* </DropdownMenuItem> */}
					<DropdownMenuSeparator className="bg-border" />
					<DropdownMenuItem
						onClick={() => mutate()}
						className="text-destructive focus:text-destructive cursor-pointer"
						disabled={isPending}
					>
						<LogOut className="mr-2 size-4" />
						{isPending ? 'Logging out...' : 'Logout'}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

import { Separator } from '@radix-ui/react-separator';
import { Link } from '@tanstack/react-router';
import {
	LayoutDashboard,
	type LucideIcon,
	TrendingUp,
	Wallet,
} from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { ThemeToggler } from '../theme/theme-toggler';

interface MenuItem {
	title: string;
	url: string;
	icon: LucideIcon;
}

const menuItems: MenuItem[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Accounts',
		url: '/accounts',
		icon: Wallet,
	},
];

export function AppSidebar() {
	const { open } = useSidebar();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				{open ? (
					<div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
						<Link to="/dashboard" className="flex items-center gap-3">
							<div className="size-9 rounded-lg bg-lime-400 flex items-center justify-center">
								<TrendingUp className="size-5 text-background" />
							</div>
							<span className="text-xl font-bold text-sidebar-foreground">
								StockFlow
							</span>
						</Link>
					</div>
				) : (
					<div className="size-8 rounded-lg bg-lime-400 flex items-center justify-center">
						<TrendingUp className="size-5 text-background" />
					</div>
				)}
			</SidebarHeader>
			<Separator orientation="horizontal" />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link
											to={item.url}
											className="text-muted-foreground [&.active]:bg-lime-500 [&.active]:text-foreground font-semibold"
										>
											<item.icon className="size-5" strokeWidth={2.5} />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<ThemeToggler />
			</SidebarFooter>
		</Sidebar>
	);
}

import { createFileRoute } from '@tanstack/react-router';
import { Wallet } from 'lucide-react';
import { Loader } from '@/components/shared/loader';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import {
	getListAllAccountsQueryOptions,
	useListAllAccounts,
} from '@/http/requests/users';
import { Route as RootLayout } from '@/pages/_home/layout';
import { AccountCard } from './-components/account-card';
import { CreateAccountModal } from './-components/create-account-modal';

export const Route = createFileRoute('/_home/accounts/')({
	component: Accounts,
	head: () => ({
		meta: [{ title: 'Accounts' }],
	}),
	loader: async ({ context: { queryClient }, parentMatchPromise }) => {
		const user = (await parentMatchPromise).loaderData?.user;

		if (!user) {
			throw new Response('User not found', { status: 404 });
		}

		await queryClient.ensureQueryData(
			getListAllAccountsQueryOptions(user.userId)
		);
	},
	pendingComponent: () => <Loader />,
});

function Accounts() {
	const { user } = RootLayout.useLoaderData();
	const { data, isLoading } = useListAllAccounts(user.userId);

	const accounts = Array.isArray(data) ? data : [];
	const hasAccounts = accounts.length > 0;

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between pt-2">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Accounts</h1>
					<p className="text-muted-foreground">
						Manage your investment portfolios and track performance
					</p>
				</div>
				<CreateAccountModal />
			</div>
			{hasAccounts ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{accounts.map(account => (
						<AccountCard key={account.accountId} account={account} />
					))}
				</div>
			) : (
				<Empty>
					<EmptyMedia variant="icon">
						<Wallet className="size-10" />
					</EmptyMedia>
					<EmptyTitle>No accounts found</EmptyTitle>
					<EmptyDescription>
						Create your first account to start investing.
					</EmptyDescription>
					<EmptyContent>
						<CreateAccountModal />
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}

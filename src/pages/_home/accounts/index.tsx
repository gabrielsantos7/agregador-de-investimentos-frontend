import { createFileRoute } from '@tanstack/react-router';
import { Wallet } from 'lucide-react';
import { Loader } from '@/components/shared/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useListAllAccounts } from '@/http/requests/users';
import { useAuth } from '@/integrations/tanstack-store/stores/auth.store';
import { CreateAccountModal } from './-components/create-account-modal';

export const Route = createFileRoute('/_home/accounts/')({
	component: Accounts,
});

function Accounts() {
	const { user } = useAuth();

	const { data, isPending: isLoading } = useListAllAccounts(user!.userId, {
		query: {
			enabled: !!user,
		},
	});

	const accounts = Array.isArray(data) ? data : [];

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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{accounts.map(account => (
					<Card key={account.accountId} className='hover:border-lime-400 transition-colors duration-400 ease-in-out'>
						<CardHeader className="flex flex-row items-start justify-between">
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-lg bg-lime-300 flex items-center justify-center">
									<Wallet className="size-5 text-lime-800" />
								</div>
								<div>
									<CardTitle className="text-lg text-foreground">
										{account.description}
									</CardTitle>
								</div>
							</div>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}

import { TanStackDevtools } from '@tanstack/react-devtools';
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { Loader } from '@/components/shared/loader';
import type { QueryClientContext } from '@/integrations/tanstack-query/root-provider';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

const RootLayout = () => (
	<Suspense fallback={<Loader />}>
		<HeadContent />
		<Outlet />
		<TanStackDevtools
			config={{
				position: 'bottom-right',
			}}
			plugins={[
				{
					name: 'Tanstack Router',
					render: <TanStackRouterDevtoolsPanel />,
				},
				TanStackQueryDevtools,
			]}
		/>
	</Suspense>
);

export const Route = createRootRouteWithContext<QueryClientContext>()({
	component: RootLayout,
});

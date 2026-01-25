import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

const RootLayout = () => (
	<>
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
	</>
);

export const Route = createRootRoute({ component: RootLayout });

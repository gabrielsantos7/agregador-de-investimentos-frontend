import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from './components/theme/theme-provider';
import { Toaster } from './components/ui/sonner';
import * as TanstackQuery from './integrations/tanstack-query/root-provider';
import { NotFound } from './pages/-404';
import { routeTree } from './routeTree.gen';

const rqContext = TanstackQuery.getContext();

const router = createRouter({
	routeTree,
	context: { ...rqContext },
	defaultNotFoundComponent: NotFound,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

export function App() {
	return (
		<TanstackQuery.Provider {...rqContext}>
			<ThemeProvider>
				<Toaster />
				<RouterProvider router={router} />
			</ThemeProvider>
		</TanstackQuery.Provider>
	);
}

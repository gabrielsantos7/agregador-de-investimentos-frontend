import { useEffect } from 'react';
import { useTheme } from '@/integrations/tanstack-store/stores/theme.store';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const theme = useTheme();

	useEffect(() => {
		const root = window.document.documentElement;

		const applyTheme = () => {
			root.classList.remove('light', 'dark');

			if (theme === 'system') {
				const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
				const systemTheme = mediaQuery.matches ? 'dark' : 'light';
				root.classList.add(systemTheme);

				const listener = (e: MediaQueryListEvent) => {
					root.classList.remove('light', 'dark');
					root.classList.add(e.matches ? 'dark' : 'light');
				};

				mediaQuery.addEventListener('change', listener);
				return () => mediaQuery.removeEventListener('change', listener);
			} else {
				root.classList.add(theme);
			}
		};

		return applyTheme();
	}, [theme]);

	return <>{children}</>;
};

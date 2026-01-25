import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
	theme: Theme;
}

const STORAGE_KEY = 'theme-preference';
const defaultTheme = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';

export const themeStore = new Store<ThemeState>({ theme: defaultTheme });

// Actions
export const setTheme = (theme: Theme) => {
	themeStore.setState(state => ({ ...state, theme }));
};

export const toggleTheme = () => {
	themeStore.setState(state => ({
		...state,
		theme: state.theme === 'light' ? 'dark' : 'light',
	}));
};

// Manual persistence
themeStore.subscribe(() => {
	console.log('Persisting theme preference:', themeStore.state);
	localStorage.setItem(STORAGE_KEY, themeStore.state.theme);
});

// Hooks
export const useTheme = () => useStore(themeStore, state => state.theme);

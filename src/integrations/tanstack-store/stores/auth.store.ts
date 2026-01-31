import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import type { UserDto } from '@/http/schemas';

export const AUTH_TOKEN_KEY = 'authToken';

interface AuthStore {
	user: UserDto | null;
	token: string | null;
}

const persistedToken = localStorage.getItem(AUTH_TOKEN_KEY);

export const authStore = new Store<AuthStore>({
	user: null,
	token: persistedToken,
});

// Actions
export const setAuthData = (user: UserDto, token: string) => {
	authStore.setState({ user, token });
};

export const logout = () => {
	authStore.setState({ user: null, token: null });
};

// Persistence
authStore.subscribe(() => {
	const { token } = authStore.state;
	if (token) {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
	} else {
		localStorage.removeItem(AUTH_TOKEN_KEY);
	}
});

// Hooks
export const useAuth = () =>
	useStore(authStore, state => ({
		user: state.user,
		token: state.token,
		isAuthenticated: !!state.token,
	}));

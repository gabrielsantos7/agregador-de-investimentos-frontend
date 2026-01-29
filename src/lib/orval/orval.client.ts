import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { authStore } from '@/integrations/tanstack-store/stores/auth.store';

const DO_NOT_401_REDIRECT_PATHS = ['/login'];

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	// withCredentials: true, // Send cookies in requests - do not needed
});

axiosInstance.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Redirect to login on 401 Unauthorized response if not already on login page
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (
			error.response?.status === 401 &&
			!DO_NOT_401_REDIRECT_PATHS.includes(window.location.pathname)
		) {
			authStore.setState({ token: null, user: null });
		}
		return Promise.reject(error);
	}
);

// Orval mutator function
export const orvalClient = async <TData, TError = unknown>(
	config: AxiosRequestConfig
): Promise<TData> => {
	try {
		const response = await axiosInstance.request<TData>(config);
		return response.data; // Orval waits for this return
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw error.response?.data as TError;
		}
		throw error;
	}
};

// Additional types for Orval
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

const DO_NOT_401_REDIRECT_PATHS = ['/auth/login'];

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	// withCredentials: true, // Send cookies in requests - do not needed
});

// Redirect to login on 401 Unauthorized response if not already on login page
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (
			error.response?.status === 401 &&
			!DO_NOT_401_REDIRECT_PATHS.includes(window.location.pathname)
		) {
			// auth.signOut(); // TODO: Uncomment and implement your sign-out logic here
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

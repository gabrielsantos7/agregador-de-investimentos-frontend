export interface ApiError {
	status: number;
	message: string;
	timestamp: string;
	fieldsErrors: null | Record<string, string[]>;
}

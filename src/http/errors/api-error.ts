export interface ApiError {
	status: number;
	message: string;
	timestamp: string;
	fieldsErrors?: Record<string, string> | null;
}

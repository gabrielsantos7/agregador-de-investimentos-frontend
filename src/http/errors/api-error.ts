export interface ApiError {
  status: number;
  response?: {
    data: {
      status: number;
      message: string;
      timestamp: string;
      errors?: Record<string, string> | null;
    };
  };
}

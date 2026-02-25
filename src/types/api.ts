export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  cursor?: string;
  has_more: boolean;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

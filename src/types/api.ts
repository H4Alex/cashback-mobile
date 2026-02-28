export interface ApiResponse<T> {
  status: true;
  data: T;
  error: null;
  message: string;
}

export interface ApiErrorResponse {
  status: false;
  data: null;
  error: {
    code: string;
    message: string;
    correlation_id?: string | null;
    details?: Record<string, string[]>;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  status: true;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
  error: null;
  message: string;
}

export interface CursorPaginatedResponse<T> {
  status: true;
  data: {
    data: T[];
    meta: {
      next_cursor: string | null;
      prev_cursor: string | null;
      per_page: number;
      has_more_pages: boolean;
    };
  };
  error: null;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/** Standard API error response */
export interface ApiError {
  status: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/** Standard API success response */
export interface ApiSuccess<T = unknown> {
  status: true;
  data: T;
}

/** Cursor-based pagination meta */
export interface CursorMeta {
  next_cursor: string | null;
  has_more: boolean;
}

/** Offset-based pagination meta */
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

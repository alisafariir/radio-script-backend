export interface PaginateResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

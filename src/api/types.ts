export interface RestResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface Page<T> {
  records: Array<T>;
  total: number;
  size: number;
  current: number;
  pages: number;
}

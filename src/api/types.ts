export interface RestResponse<T> {
  code: number;
  msg: string;
  result: T;
}
export interface Page<T> {
  records: Array<T>;
  total: number;
  size: number;
  current: number;
  pages: number;
}

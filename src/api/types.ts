export interface Page<T> {
  records: Array<T>;
  total: number;
  size: number;
  current: number;
  pages: number;
}

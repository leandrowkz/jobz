export type JobAPIResponseAdapter<T> = {
  list: T[],
  count: number,
  currentPage: number,
  pageSize: number,
}

export type JobAPIResponseList<T> = {
  data: T[],
  meta: {
    count: number,
    pagination: {
      prev: number,
      next: number,
      pages: number,
      current: number,
      pageSize: number,
    },
  },
}

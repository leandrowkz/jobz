import { JobAPIResponseCode } from './JobAPIResponseCode'

export type JobAPIResponseList<T> = {
  status: JobAPIResponseCode,
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

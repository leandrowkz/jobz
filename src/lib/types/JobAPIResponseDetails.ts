import { JobAPIResponseCode } from './JobAPIResponseCode'

export type JobAPIResponseDetails<T> = {
  data: T,
  status: JobAPIResponseCode,
}

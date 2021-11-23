import { JobAPIResponseCode } from './JobAPIResponseCode'

export type JobAPIResponseError = {
  status: JobAPIResponseCode.Failed,
  error: string,
}

import { JobQueueListenerMode } from './JobQueueListenerMode';

export type JobzOptions = {
  db: {
    host: string
    port: number
    database: string
    username?: string
    password?: string
  },
  maxConcurrency?: number,
  queueListenerMode?: JobQueueListenerMode,
  pollingInterval?: number,
}

import { JobzQueueListenerMode } from './JobzQueueListenerMode';

export type JobzOptions = {
  db: {
    host: string
    port: number
    database: string
    username?: string
    password?: string
  },
  maxConcurrency?: number,
  queueListenerMode?: JobzQueueListenerMode,
  pollingInterval?: number,
}

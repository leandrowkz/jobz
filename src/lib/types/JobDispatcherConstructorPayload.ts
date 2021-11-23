import { Connection } from 'typeorm'
import { JobRegister } from '../JobRegister'
import { JobQueueListenerMode } from './JobQueueListenerMode'

export type JobDispatcherConstructorPayload = {
  connection: Connection,
  register: JobRegister,
  options: {
    pollingInterval: number,
    queueListenerMode: JobQueueListenerMode,
  },
}

import { Connection } from 'typeorm'
import { JobRegister } from '../JobRegister'
import { JobzQueueListenerMode } from './JobzQueueListenerMode'

export type JobDispatcherConstructorPayload = {
  connection: Connection,
  register: JobRegister,
  options: {
    pollingInterval: number,
    queueListenerMode: JobzQueueListenerMode,
  },
}
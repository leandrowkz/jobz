import { Connection } from 'typeorm'
import { JobRegister } from '../JobRegister'

export type JobSchedulerConstructorPayload = {
  connection: Connection,
  register: JobRegister,
  options: {
    //
  },
}
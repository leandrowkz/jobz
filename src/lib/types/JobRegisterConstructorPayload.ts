import { Connection } from 'typeorm'

export type JobRegisterConstructorPayload = {
  connection: Connection,
  options: {
    maxConcurrency: number
  },
}
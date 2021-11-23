import { Connection } from 'typeorm'

export type JobAPIServiceConstructorPayload = {
  connection: Connection
}

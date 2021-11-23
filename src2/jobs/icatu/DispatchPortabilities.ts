import { injectable } from 'tsyringe'
import { Job } from '@/jobs'

@injectable()
export class DispatchPortabilities extends Job {
  public name = 'icatu:dispatch-portabilities'

  public async handle(args: string[]) {
    const message = 'JOB_DISPATCHED'
    this.logger.info(message, args)
  }
}

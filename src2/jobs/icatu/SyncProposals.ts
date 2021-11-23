import { inject, injectable } from 'tsyringe'
import { Job } from '@/jobs'
import { tokens } from '@/di/tokens'
import { IcatuService } from '@/domain/IcatuService'

@injectable()
export class SyncProposals extends Job {
  public name = 'icatu:sync-proposals'

  constructor(
    @inject(tokens.IcatuService)
    protected service: IcatuService
  ) {
    super()
  }

  public async handle() {
    this.call('icatu:dispatch-portabilities', ['0000123040124'])
    setInterval(() => {
      const message = `SINC_PROPOSALS_DISPATCHED_${Math.random()}`
      this.logger.info(message)
      // this.service.doSomething()
    }, 1000)
  }
}

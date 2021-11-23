// @ts-ignore
import { createOutputInterceptor } from 'output-interceptor'
import { Connection } from 'typeorm'
import { Job } from '.'
import { EJobResult } from './EJobResult'
import { EJobStatus } from './EJobStatus'
import { JobExecution } from './JobExecution'

export class JobDispatcher {
  protected execution!: JobExecution
  protected connection!: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  public async dispatch(job: Job): Promise<void> {
    let output = ''
    // const intercept = require('intercept-stdout')
    // const stopIntercept = intercept((txt: string) => {
    //   output += txt
    // })

    try {
      output = await this.startExecution(job)
    } catch (e) {
      let message = ''
      if (e instanceof Error) {
        console.error(e.message)
        console.error(e.stack)
        message = e.message
      }

      await this.failExecution(message)
    } finally {
      // stopIntercept()

      await this.finishExecution(output)
    }
  }

  protected async startExecution(job: Job): Promise<string> {
    const interceptOutput = createOutputInterceptor()
    
    await interceptOutput(async () => {
      this.execution = new JobExecution()
      this.execution.status = EJobStatus.Running
      this.execution.result = EJobResult.Pending
      this.execution.jobName = job.name
      this.execution.startedAt = new Date
      
      await this.saveExecution()

      await job.handle()
    })

    return interceptOutput.output || ''
  }

  protected async failExecution(message: string) {
    if (this.execution) {
      this.execution.result = EJobResult.Fail
      this.execution.errorReason = message
      
      await this.saveExecution()
    }
  }

  protected async finishExecution(output: string) {
    this.execution.output = output
    this.execution.result = EJobResult.Success
    this.execution.status = EJobStatus.Done
    this.execution.finishedAt = new Date
    this.execution.durationMs = (this.execution.finishedAt.getTime() - this.execution.startedAt.getTime()) / 1000

    await this.saveExecution()
  }

  protected async saveExecution() {
    const { manager } = this.connection
    await manager.save(this.execution)
  }
}

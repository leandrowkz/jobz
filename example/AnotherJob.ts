import { Job } from '../src'

export class AnotherJob implements Job {
  public name: string = 'AnotherJob'

  public async handle(): Promise<void> {
    console.log(`[${new Date}] ${this.name}: This is a Job Execution.`)
  }
}
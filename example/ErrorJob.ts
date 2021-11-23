import { Job } from '../src'

export class ErrorJob implements Job {
  public name: string = 'ErrorJob'

  public async handle(): Promise<void> {
    console.log(`[${new Date}] ${this.name}: This is a ErrorJob Execution.`)
    console.log('barbarito');

    [1,2,3,4,5,6,7].forEach(element => {
      console.log(`${element}: Log loco`)
    });

    const division = 0 / 1
    const division0 = 1 / 0

    console.error('HOW THE ROOOOO', division, division0)

    throw Error('ERROR_JOB')
  }
}
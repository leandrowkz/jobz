import { Job } from '../src'

export class ExampleJob implements Job {
  public name: string = 'ExampleJob'

  public async handle(): Promise<void> {
    const id = Math.random()
    let date = new Date()

    console.log(`[${id}][${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${this.name}`)

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(1200)
    await sleep(10000)

    date = new Date

    console.log(`[${id}][${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${this.name}`)
  }
}
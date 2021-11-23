import debug from 'debug'
import nodeScheduler from 'node-schedule'
import { createConnection, Connection } from 'typeorm'
import { SchedulerOptions } from './SchedulerOptions'
import { Job } from './Job'
import { JobDispatcher } from './JobDispatcher'
import { JobExecution } from './JobExecution'
import { JobRegister } from '.'

export class JobScheduler {
  protected scheduler
  protected _register: JobRegister
  protected options: SchedulerOptions
  protected connection!: Connection

  constructor(options: SchedulerOptions) {
    this.options = options
    this.scheduler = nodeScheduler
    this._register = new JobRegister
  }

  protected async initConnection() {
    const { mongo } = this.options
    this.connection = await createConnection({
      type: 'mongodb',
      host: mongo.host,
      port: mongo.port,
      database: mongo.database,
      username: mongo.username,
      password: mongo.password,
      entities: [
        JobExecution
      ]
    })
  }

  public async start() {
    await this.initConnection()
  }

  public async register(jobName: string, jobPath: string): Promise<void> {
    this._register.register(jobName, jobPath)
  }

  public async schedule(cron: string, job: Job): Promise<void> {
    const dispatcher = new JobDispatcher(this.connection)

    debug(`[JOB SCHEDULED]: ${cron}, ${job.name}`)

    this.scheduler.scheduleJob(cron, async () => {
      await dispatcher.dispatch(job)
    })
  }
}

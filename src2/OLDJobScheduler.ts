import debug from 'debug'
import nodeScheduler from 'node-schedule'
import { createConnection, Connection, FindManyOptions } from 'typeorm'
import { SchedulerOptions } from './SchedulerOptions'
import { Job } from './Job'
import { JobDispatcher } from './JobDispatcher'
import { JobExecution } from './JobExecution'
import { JobRepository } from './JobRepository'

type APIListRequest = {
  page?: number,
  pageSize?: number,
  query?: string,
}

type APIListResponse<T> = {
  data: T[],
  meta: {
    count: number,
    pagination: {
      next: string,
      prev: string,
      pages: number,
      current: number,
      pageSize: number,
    },
  },
}

export class JobScheduler {
  protected scheduler
  protected dispatcher!: JobDispatcher
  protected connection!: Connection
  protected repository!: JobRepository
  protected options: SchedulerOptions

  constructor(options: SchedulerOptions) {
    this.options = options
    this.scheduler = nodeScheduler
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

  // protected async initRepository() {
  //   // const { getCustomRepository } = this.connection
  //   this.repository = getCustomRepository(JobRepository)
  // }

  public async start() {
    await this.initConnection()
    // await this.initRepository()
  }

  public async schedule(cron: string, job: Job): Promise<void> {
    debug(`[JOB SCHEDULED]: ${cron}, ${job.name}`)

    this.scheduler.scheduleJob(cron, () => {
      Object.defineProperty(job, '_scheduleRule', { value: cron })
      
      const dispatcher = new JobDispatcher()
      dispatcher.dispatch(job)
    })
  }

  public async getJobExecution(payload: APIListRequest): Promise<APIListResponse<JobExecution>> {
    const currentPage = Number(payload.page) || 1
    const pageSize = Number(payload.pageSize) || 30
    
    const response: APIListResponse<JobExecution> = {
      data: [],
      meta: {
        count: 0,
        pagination: {
          prev: '',
          next: '',
          pages: 0,
          current: currentPage,
          pageSize: pageSize,
        }   
      }
    }

    try {
      const options: FindManyOptions<JobExecution> = {
        order: {
          status: 'DESC'
        },
        take: pageSize,
        skip: pageSize <= 1 ? 0 : (currentPage * pageSize),
      }

      console.log(options)

      const [jobs, count] = await JobExecution.all(options)
      
      response.data = jobs
      response.meta.count = count
      response.meta.pagination.pages = Math.floor(count / pageSize)

      const nextPage = (currentPage + 1) > response.meta.pagination.pages ? response.meta.pagination.pages : (currentPage + 1)
      const prevPage = (currentPage - 1) <= 0 ? 1 : (currentPage - 1)
      
      response.meta.pagination.next = `?page=${nextPage}&pageSize=${pageSize}`
      response.meta.pagination.prev = `?page=${prevPage}&pageSize=${pageSize}`

    } catch (e) {
      console.log(e)
    }

    return response
  }
}

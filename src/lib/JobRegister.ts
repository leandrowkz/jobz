import { getMongoRepository, Connection } from 'typeorm'
import { Job } from './Job'
import { JobModel } from './models'
import { JobRegisterConstructorPayload, JobPool, JobStatus } from './types'

export class JobRegister {
  public jobs: JobPool = {}
  protected connection: Connection
  protected maxConcurrency: number

  constructor(payload: JobRegisterConstructorPayload) {
    this.connection = payload.connection
    this.maxConcurrency = payload.options.maxConcurrency
  }

  /**
   * Update all JobModel documents, setting hasHandler = false.
   */
  public async clearJobHandlers(): Promise<void> {
    const repo = getMongoRepository(JobModel)

    await repo.updateMany({}, [{
      $set: { hasHandler: false, scheduleRules: [] }
    }])
  }

  /**
   * Register a new Job based on name.
   * If a job already exists with this name then update 
   * 
   * @param jobName 
   * @param callback 
   */
  public async register(jobName: string, jobInstance: Job): Promise<void> {
    if (!jobName) {
      throw Error('Error registering Job: Name must be provided.')
    }

    if (!jobInstance) {
      throw Error('Error registering Job: Callback must be provided.')
    }

    let job = await JobModel.findByName(jobName)

    if (!job) {
      job = new JobModel()
      job.name = jobName
      job.status = JobStatus.Enabled
      job.labels = []
    }

    job.hasHandler = true
    job.runningCount = 0
    job.scheduleRules = []
    job.maxConcurrency = this.maxConcurrency

    await job.save()

    this.jobs[jobName] = jobInstance
  }

  /**
   * Checks if given job is registered by name.
   * 
   * @param jobName 
   * @param boolean 
   */
  public isRegistered(jobName: string): boolean {
    return Boolean(this.jobs[jobName])
  }

  /**
   * Returns a Job instance to be executed.
   * 
   * @param jobName 
   * @param Job 
   */
   public getHandler(jobName: string): Job {
    return this.jobs[jobName]
  }
}

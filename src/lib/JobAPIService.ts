import { Connection, FindManyOptions } from 'typeorm'
import { JobModel, JobExecutionModel } from './models'
import {
  JobAPIRequestList,
  JobAPIResponseAdapter,
  JobAPIResponseCode,
  JobAPIResponseDetails,
  JobAPIResponseList,
  JobAPIServiceConstructorPayload,
  JobExecutionStatus,
  JobExecutionTrigger,
  JobStatus,
} from './types'

export class JobAPIService {
  protected connection: Connection
  protected optionsDefault = {
    pageSize: 30,
    currentPage: 1,
  }

  constructor(payload: JobAPIServiceConstructorPayload) {
    this.connection = payload.connection
  }

  /**
   * Gets all available Jobs with pagination.
   *
   * @param JobAPIRequestList
   * @returns JobAPIResponseList
   */
  public async getAllJobs(payload: JobAPIRequestList): Promise<JobAPIResponseList<JobModel>> {
    const pageSize = Number(payload.pageSize) || this.optionsDefault.pageSize
    const currentPage = Number(payload.page) || this.optionsDefault.currentPage

    const options: FindManyOptions<JobModel> = {
      order: {
        status: 'DESC'
      },
      take: pageSize,
      skip: currentPage <= 1 ? 0 : (currentPage * pageSize),
    }

    const [list, count] = await JobModel.findAndCount(options)

    return this.toResponseList({
      list,
      count,
      pageSize,
      currentPage,
    })
  }

  /**
   * Gets all available Job executions for a given Job id.
   *
   * @param JobAPIRequestList
   * @returns JobAPIResponseList<T>
   */
  public async getAllJobExecutions(payload: JobAPIRequestList): Promise<JobAPIResponseList<JobExecutionModel>> {
    if (!payload.id) {
      throw Error('Error fetching Job for JobExecutions: JobID not provided.')
    }

    const job = await JobModel.findOne(payload.id)

    if (!job) {
      throw Error('Error fetching Job for JobExecutions: Job not found.')
    }

    const { pageSize, currentPage } = this.getPaginationInfo(payload)

    const options: FindManyOptions<JobExecutionModel> = {
      order: { status: 'DESC' },
      select: JobExecutionModel.QUERY_COLUMNS,
      where: { name: job.name },
      take: pageSize,
      skip: currentPage <= 1 ? 0 : (currentPage * pageSize),
    }

    const [list, count] = await JobExecutionModel.findAndCount(options)

    return this.toResponseList({
      list,
      count,
      pageSize,
      currentPage,
    })
  }

  /**
   * Gets specific Job data.
   *
   * @param string
   * @returns JobModel
   */
  public async getJobDetails(id: string): Promise<JobAPIResponseDetails<JobModel>> {
    const job = await JobModel.findOne(id)

    if (!job) {
      throw Error('Error fetching Job details: Job not found.')
    }

    return this.toResponseDetails(job)
  }

  /**
   * Gets specific JobExecution data.
   *
   * @param string
   * @returns JobExecutionModel
   */
  public async getJobExecutionDetails(id: string): Promise<JobAPIResponseDetails<JobExecutionModel>> {
    const execution = await JobExecutionModel.findOne(id)

    if (!execution) {
      throw Error('Error fetching JobExecution details: JobExecution not found.')
    }

    execution.job = await JobModel.findOne({ name: execution.name })

    return this.toResponseDetails(execution)
  }

  /**
   * Set status for given Job specific JobExecution data.
   *
   * @param id
   * @param JobStatus
   * @returns JobModel
   */
   public async setJobStatus(id: string, status: JobStatus): Promise<JobAPIResponseDetails<JobModel>> {
    const job = await JobModel.findOne(id)

    if (!job) {
      throw Error('Error setting Job status: Job not found.')
    }

    job.status = status
    await job.save()

    return this.toResponseDetails(job)
  }

  /**
   * Trigger a JobExecution.
   *
   * @param id
   * @return JobModel
   */
   public async runJobManually(id: string): Promise<JobAPIResponseDetails<JobModel>> {
    const job = await JobModel.findOne(id)

    if (!job) {
      throw Error('Error setting Job status: Job not found.')
    }

    const exec = new JobExecutionModel()
    exec.name = job.name
    exec.trigger = JobExecutionTrigger.Manual
    exec.status = JobExecutionStatus.Enqueued

    // Job listener will intercept this and dispatch job
    await exec.save()

    const response = this.toResponseDetails(job)
    response.status = JobAPIResponseCode.Enqueued

    return response
  }

  /**
   * Normalize a list to an API paginated response.
   *
   * @param JobAPIResponseAdapter<T>
   * @returns JobAPIResponseList<T>
   */
  protected toResponseList<T>(payload: JobAPIResponseAdapter<T>): JobAPIResponseList<T> {
    const { list, count, currentPage, pageSize } = payload

    const response: JobAPIResponseList<T> = {
      status: JobAPIResponseCode.Success,
      data: list,
      meta: {
        count: 0,
        pagination: {
          prev: 0,
          next: 0,
          pages: 0,
          current: currentPage,
          pageSize: pageSize,
        }
      }
    }

    response.data = list
    response.meta.count = count
    response.meta.pagination.pages = Math.ceil(count / pageSize)
    response.meta.pagination.next = (currentPage + 1) > response.meta.pagination.pages ? response.meta.pagination.pages : (currentPage + 1)
    response.meta.pagination.prev = (currentPage - 1) <= 0 || currentPage > response.meta.pagination.pages ? 1 : (currentPage - 1)

    return response
  }

  /**
   * Normalize a given item to an API details response.
   *
   * @param item
   * @returns JobAPIResponseDetails<T>
   */
   protected toResponseDetails<T>(item: T): JobAPIResponseDetails<T> {
    return {
      status: JobAPIResponseCode.Success,
      data: item,
    }
  }

  /**
   * Build a pagination info object based on given request payload.
   *
   * @param payload
   * @returns { pageSize, currentPage }
   */
  protected getPaginationInfo(payload: JobAPIRequestList) {
    const pageSize = Number(payload.pageSize) || this.optionsDefault.pageSize
    const currentPage = Number(payload.page) || this.optionsDefault.currentPage

    return {
      pageSize,
      currentPage
    }
  }
}

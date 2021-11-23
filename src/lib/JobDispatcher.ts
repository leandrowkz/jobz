// @ts-ignore
import { createOutputInterceptor } from 'output-interceptor'
import { Connection } from 'typeorm'
import { JobRegister } from './JobRegister'
import { JobModel, JobExecutionModel } from './models'
import {
  JobDispatcherConstructorPayload,
  JobExecutionStatus,
  JobzQueueListenerMode,
} from './types'

export class JobDispatcher {
  protected connection: Connection
  protected register: JobRegister
  protected queueListenerMode: JobzQueueListenerMode
  protected pollingInterval: number

  constructor(payload: JobDispatcherConstructorPayload) {
    this.connection = payload.connection
    this.register = payload.register
    this.queueListenerMode = payload.options.queueListenerMode
    this.pollingInterval = payload.options.pollingInterval
  }

  /**
   * Start listening for Job queue (JobExecution collection).
   * When a job is inserted in collection then dispatches it.
   */
  public async startListenQueue(): Promise<void> {
    if (this.queueListenerMode === JobzQueueListenerMode.Listener) {
      const { mongoManager } = this.connection
      const pipeline = [{ $match: { operationType: 'insert' } }]
      const stream = mongoManager.watch(JobExecutionModel, pipeline)

      stream.on('change', async (data: { documentKey: { _id: string } }) => {
        const exec = await JobExecutionModel.findOne(data.documentKey._id)
        
        if (!exec) return;

        this.dispatch(exec)
      })
    }

    if (this.queueListenerMode === JobzQueueListenerMode.Polling) {
      setInterval(() => {
        this.processAllPendingJobs()
      }, this.pollingInterval)
    }
  }

  /**
   * Fetches all Jobs in 'pending' statuses (stucked/enqueued).
   * Trigger each one execution.
   */
  public async processAllPendingJobs(): Promise<void> {
    const pending = await JobExecutionModel.find({ where: {
      $or: [
        { status: JobExecutionStatus.Stucked },
        { status: JobExecutionStatus.Enqueued },
      ]
    }})

    for (const execution of pending) {
      this.dispatch(execution)
    }
  }

  /**
   * Runs a given JobExecution enqueued.
   * Find handler by name and trigger run for it.
   * 
   * @param execution
   */
  public async dispatch (execution: JobExecutionModel): Promise<void> {
    if (execution.status !== JobExecutionStatus.Enqueued) {
      return
    }

    const job = this.register.getHandler(execution.name)
    const model = await JobModel.findByName(execution.name)
  
    if (!job || !model) {
      return
    }

    const interceptOutput = createOutputInterceptor()
    
    await interceptOutput(async () => {
      try {  
        model.runningCount = model.runningCount + 1
        await model.save()

        execution.status = JobExecutionStatus.Running
        execution.startedAt = new Date
        await execution.save()

        await job.handle({ ...execution.params })
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message)
          console.error(e.stack)
          execution.failReason = e.message
        }

        execution.status = JobExecutionStatus.Failed
        await execution.save()
        
      } finally {
        model.runningCount = model.runningCount - 1
        model.lastRunAt = new Date
        await model.save()
      }
    })

    execution.output = interceptOutput.output || ''
    execution.finishedAt = new Date
    execution.durationMs = (execution.finishedAt.getTime() - execution.startedAt.getTime()) / 1000

    // @ts-ignore
    if (execution.status === JobExecutionStatus.Running) {
      execution.status = JobExecutionStatus.Done
    }

    await execution.save()
  }
}

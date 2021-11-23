import debug from 'debug'
import nodeScheduler from 'node-schedule'
import { Connection } from 'typeorm'
import { JobRegister } from './JobRegister'
import { JobModel, JobExecutionModel } from './models'
import { JobSchedulerConstructorPayload, JobExecutionStatus, JobStatus, JobExecutionTrigger } from './types'

export class JobScheduler {
  protected scheduler
  protected register: JobRegister
  protected connection: Connection

  constructor(payload: JobSchedulerConstructorPayload) {
    this.connection = payload.connection
    this.register = payload.register
    this.scheduler = nodeScheduler
  }

  /**
   * Schedule a Job to be executed.
   * Checks if job is defined, and when it is time
   * enqueue a new execution to be processed by JobProcessor.
   *
   * @param cron
   * @param jobName
   */
  public async schedule(cron: string, jobName: string): Promise<void> {
    debug(`[Jobz] Job scheduled: ${jobName}, ${cron}`)

    if (!this.register.isRegistered(jobName)) {
      throw Error('Error scheduling Job: Given job is not registered yet.')
    }

    const job = await JobModel.findByName(jobName)

    if (!job || !job.hasHandler) {
      throw Error('Error scheduling Job: Given job has no handler or does not exist. Try to define job first.')
    }
    console.log(job)

    job.scheduleRules.push(cron)
    job.save()

    this.scheduler.scheduleJob(cron, async () => {
      const job = await JobModel.findByName(jobName)

      if (!job) return;
      if (job.runningCount >= job.maxConcurrency) return;
      if (job.status === JobStatus.Disabled) return;

      const exec = new JobExecutionModel()
      exec.name = jobName
      exec.scheduleRule = cron
      exec.trigger = JobExecutionTrigger.Schedule
      exec.status = JobExecutionStatus.Enqueued
      exec.save()
    })
  }
}

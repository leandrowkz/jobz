import { createConnection, Connection } from 'typeorm'
import { Job } from './Job'
import { JobDispatcher } from './JobDispatcher'
import { JobScheduler } from './JobScheduler'
import { JobRegister } from './JobRegister'
import { JobModel, JobExecutionModel } from './models'
import { JobzOptions, JobzQueueListenerMode } from './types'

export class Jobz {
  protected optionsDefault: JobzOptions = {
    db: {
      port: 0,
      host: '',
      database: '',
    },
    maxConcurrency: 1,
    pollingInterval: 1000,
    queueListenerMode: JobzQueueListenerMode.Default,
  }
  protected options: JobzOptions
  protected connection!: Connection
  protected registry!: JobRegister
  protected scheduler!: JobScheduler
  protected dispatcher!: JobDispatcher

  public constructor(options: JobzOptions) {
    this.options = { ...this.optionsDefault, ...options }
  }

  /**
   * Initialize Jobz.
   * 
   * Make a database connection based on constructor options.
   * Make a new JobRegister instance.
   * Make a new JobScheduler instance.
   * Make a new JobProcessor instance.
   * Clear all handlers for already registered Jobs.
   * Start dispatcher listener.
   */
  public async initialize(): Promise<void> {
    const {
      host,
      port,
      database,
      username,
      password,
    } = this.options.db
    
    this.connection = await createConnection({
      type: 'mongodb',
      host: host,
      port: port,
      database: database,
      username: username,
      password: password,
      entities: [
        JobModel,
        JobExecutionModel,
      ],
    })
    
    await this.initRegister()
    await this.initScheduler()
    await this.initDispatcher()
  }

  /**
   * Initialize JobRegister instance, responsible for registering
   * available Jobs and its handler classes.
   * Also clear all hasHandler for already-created Jobs.
   */
  protected async initRegister(): Promise<void> {
    this.registry = new JobRegister({
      connection: this.connection,
      options: {
        maxConcurrency: this.options.maxConcurrency!
      }
    })

    await this.registry.clearJobHandlers()
  }

  /**
   * Initialize JobScheduler instance, responsible for
   * .register() method.
   */
  protected async initScheduler(): Promise<void> {
    this.scheduler = new JobScheduler({
      connection: this.connection,
      register: this.registry,
      options: {}
    })
  }

  /**
   * Initialize JobDispatcher instance, responsible for
   * listening enqueued Jobs and running them.
   * Also starts listening to job queue (changeStream or polling).
   */
  protected async initDispatcher(): Promise<void> {
    this.dispatcher = new JobDispatcher({
      connection: this.connection,
      register: this.registry,
      options: {
        pollingInterval: this.options.pollingInterval!,
        queueListenerMode: this.options.queueListenerMode!,
      }
    })
  }

  /**
   * Start Jobz.
   * 
   * 1) Process all pending Jobs
   * 2) Start listening to new enqueued Jobs
   */
  public async start () {
    this.dispatcher.processAllPendingJobs()
    this.dispatcher.startListenQueue()
  }

  /**
   * Register a new Job on DB and associates a Job instance
   * as handler to it.
   * 
   * @param jobName 
   * @param jobInstance 
   */
  public async register(jobName: string, jobInstance: Job): Promise<void> {
    return this.registry.register(jobName, jobInstance)
  }

  /**
   * Schedule a Job execution based on cron expression.
   * 
   * @param cron 
   * @param jobName 
   */
  public async schedule(cron: string, jobName: string): Promise<void> {
    return this.scheduler.schedule(cron, jobName)
  }
}
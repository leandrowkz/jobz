// // @ts-ignore
// import { createOutputInterceptor } from 'output-interceptor'
// import { Job } from './Job'
// import { EJobStatus } from './types/EJobExecutionStatus'
// import { JobExecution } from './JobExecution'
// // import { JobRepository } from './JobRepository'

// export class JobDispatcher {
//   protected execution!: JobExecution

//   public async dispatch(job: Job): Promise<void> {
//     const interceptOutput = createOutputInterceptor()
    
//     await interceptOutput(async () => {
//       try {
//         await this.startExecution(job)
//         await job.handle()
//       } catch (e) {

//         let message = ''
//         if (e instanceof Error) {
//           console.error(e.message)
//           console.error(e.stack)
//           message = e.message
//         }

//         await this.failExecution(message)
//       }
//     })

//     const output = interceptOutput.output || ''
//     await this.finishExecution(output)
//   }

//   protected async startExecution(job: Job): Promise<void> {
//     this.execution = new JobExecution()
//     this.execution.name = job.name
//     this.execution.status = EJobStatus.Running
//     this.execution.scheduleRule = (job as unknown as { _scheduleRule: string })._scheduleRule || ''
//     this.execution.startedAt = new Date

//     await this.execution.save()
//   }

//   protected async failExecution(message: string) {
//     if (this.execution) {
//       this.execution.status = EJobStatus.Failed
//       this.execution.failReason = message

//       await this.execution.save()
//     }
//   }

//   protected async finishExecution(output: string) {
//     this.execution.output = output
//     this.execution.finishedAt = new Date
//     this.execution.durationMs = (this.execution.finishedAt.getTime() - this.execution.startedAt.getTime()) / 1000

//     if (this.execution.status === EJobStatus.Running) {
//       this.execution.status = EJobStatus.Done
//     }

//     await this.execution.save()
//   }
// }

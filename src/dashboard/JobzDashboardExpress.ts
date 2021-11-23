import path from 'path'
import express, { Request, Response } from 'express'
import { Jobz } from '../lib/Jobz'
import { JobAPIResponseCode, JobAPIResponseError, JobStatus } from '../lib/types';

export const JobzDashboardExpress = (jobz: Jobz) => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }));
  app.use('/', express.static(path.join(__dirname, './app')));

  const buildErrorResponse = (error: unknown): JobAPIResponseError => {
    let message = (error instanceof Error)
      ? error.message
      : 'JobzDashboardError'

    return {
      status: JobAPIResponseCode.Failed,
      error: message,
    }
  }

  app.get('/api/jobs', async (request: Request, response: Response) => {
    try {
      const jobs = await jobz.api.getAllJobs(request.query)

      response.json(jobs)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  app.get('/api/jobs/:jobId', async (request: Request, response: Response) => {
    try {
      const { jobId } = request.params
      const job = await jobz.api.getJobDetails(jobId)

      response.json(job)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  app.get('/api/jobs/:jobId/executions', async (request: Request, response: Response) => {
    try {
      request.query.id = request.params.jobId
      const executions = await jobz.api.getAllJobExecutions(request.query)

      response.json(executions)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  app.get('/api/jobs/:jobId/executions/:execId', async (request: Request, response: Response) => {
    try {
      const { execId } = request.params
      const executions = await jobz.api.getJobExecutionDetails(execId)

      response.json(executions)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  app.post('/api/jobs/:jobId/run', async (request: Request, response: Response) => {
    try {
      const { jobId } = request.params
      const job = await jobz.api.runJobManually(jobId as string)

      response.json(job)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  app.post('/api/jobs/:jobId/enable', async (request: Request, response: Response) => {
    try {
      const { jobId } = request.params
      const status = JobStatus.Enabled
      const job = await jobz.api.setJobStatus(jobId, status)

      response.json(job)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  app.post('/api/jobs/:jobId/disable', async (request: Request, response: Response) => {
    try {
      const { jobId } = request.params
      const status = JobStatus.Disabled
      const job = await jobz.api.setJobStatus(jobId, status)

      response.json(job)
    } catch (error) {
      response.status(400).json(buildErrorResponse(error))
    }
  })

  return app
};

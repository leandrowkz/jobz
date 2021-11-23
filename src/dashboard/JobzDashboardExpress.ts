import path from 'path'
import express, { Request, Response } from 'express'
import { Jobz } from '../lib/Jobz'
import { JobStatus } from '@/lib/types';

export const JobzDashboardExpress = (jobz: Jobz) => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }));
  app.use('/', express.static(path.join(__dirname, './app')));

  app.get('/api/jobs', async (request: Request, response: Response) => {
    try {
      const jobs = await jobz.api.getAllJobs(request.query)

      response.json(jobs)
    } catch (error) {
      response.status(400).json(error)
    }
  })

  app.get('/api/jobs/:id', async (request: Request, response: Response) => {
    try {
      const { id } = request.params
      const job = await jobz.api.getJobDetails(id as string)

      response.json(job)
    } catch (error) {
      response.status(400).json(error)
    }
  })

  app.post('/api/jobs/:id/run', async (request: Request, response: Response) => {
    try {
      const { id } = request.params
      const job = await jobz.api.runJobManually(id as string)

      response.json(job)
    } catch (error) {
      response.status(400).json(error)
    }
  })

  app.post('/api/jobs/:id/enable', async (request: Request, response: Response) => {
    try {
      const { id } = request.params
      const status = JobStatus.Enabled
      const job = await jobz.api.setJobStatus(id as string, status)

      response.json(job)
    } catch (error) {
      response.status(400).json(error)
    }
  })

  app.post('/api/jobs/:id/disable', async (request: Request, response: Response) => {
    try {
      const { id } = request.params
      const status = JobStatus.Disabled
      const job = await jobz.api.setJobStatus(id as string, status)

      response.json(job)
    } catch (error) {
      response.status(400).json(error)
    }
  })

  app.post('/api/executions/:id', async (request: Request, response: Response) => {
    try {
      request.query.id = request.params.id
      const executions = await jobz.api.getAllJobExecutions(request.query)

      response.json(executions)
    } catch (error) {
      response.status(400).json(error)
    }
  })

  return app
};

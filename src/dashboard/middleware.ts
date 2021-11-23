import path from 'path'
import express, { Request, Response } from 'express'
import { Jobz } from '../lib/Jobz'

export const JobzDash = (_jobz: Jobz) => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }));
  app.use('/', express.static(path.join(__dirname, './public')));

  app.get('/api/jobs', async (_request: Request, response: Response) => {
    try {
      // const {
      //   job,
      //   state,
      //   skip,
      //   limit,
      //   q,
      //   property,
      //   isObjectId,
      // } = request.query;
      // const jobs = await jobz.getJobExecution(request.query)
      const jobs: any[] = []
      response.json(jobs);
    } catch (error) {
      response.status(400).json(error);
    }
  })

  // app.post("/api/jobs/requeue", async (request, response) => {
  //   try {
  //     const newJobs = await requeueJobs(request.body.jobIds);
  //     response.send(newJobs);
  //   } catch (error) {
  //     response.status(404).json(error);
  //   }
  // });

  // app.post("/api/jobs/delete", async (request, response) => {
  //   try {
  //     const deleted = await deleteJobs(request.body.jobIds);
  //     if (deleted) {
  //       response.json({ deleted: true });
  //     } else {
  //       response.json({ message: "Jobs not deleted" });
  //     }
  //   } catch (error) {
  //     response.status(404).json(error);
  //   }
  // });

  // app.post("/api/jobs/create", async (request, response) => {
  //   try {
  //     await createJob(
  //       request.body.jobName,
  //       request.body.jobSchedule,
  //       request.body.jobRepeatEvery,
  //       request.body.jobData
  //     );
  //     response.json({ created: true });
  //   } catch (error) {
  //     response.status(400).json(error);
  //   }
  // });

  return app
};
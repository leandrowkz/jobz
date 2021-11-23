import express from 'express'
import { Jobz, JobzDash } from '../src'
import { AnotherJob } from './AnotherJob'
import { ErrorJob } from './ErrorJob'
import { ExampleJob } from './ExampleJob'
import { TMDBFetcherJob } from './TMDBFetcherJob'
;
(async() => {

  const app = express()

  const jobz = new Jobz({
    db: {
      // uri: 'mongodb://mongo:mongo@mongo:27017',
      host: 'localhost',
      port: 27017,
      database: 'jobz',
      username: 'mongo',
      password: 'mongo',
    }
  })

  await jobz.initialize()

  await jobz.register('example-job', new ExampleJob)
  await jobz.register('another-job', new AnotherJob)
  await jobz.register('tmdb-fetcher', new TMDBFetcherJob)
  await jobz.register('error-job', new ErrorJob)

  // scheduler.register('icatu:example-job', `${__dirname}/ExampleJob.ts`)
  // scheduler.register('icatu:another-job', `${__dirname}/AnotherJob.ts`)
  
  // await scheduler.schedule(new ErrorJob).every(5).minutes()

  // await scheduler.every(5).minutes().run(ErrorJob)

  // Every 5 seconds
  await jobz.schedule('*/5 * * * * *', 'example-job')

  // Every 20 minutes
  await jobz.schedule('*/20 * * * * *', 'tmdb-fetcher')

  // Every 3 minutes
  await jobz.schedule('0 */3 * * * *', 'error-job')

  // Every 2 minutes
  await jobz.schedule('0 */2 * * * *', 'another-job')

  // Every thursday at 15:46
  await jobz.schedule('0 46 15 * * 4', 'another-job')

  // Every 2 hours starting from 14:00
  await jobz.schedule('0 0 14/2 * * *', 'error-job')

  // await scheduler.schedule('every 5 seconds', new ErrorJob)

  // await scheduler.schedule('every 15 minutes', new ErrorJob)
  
  // await scheduler.schedule('every thursday 13:39', new ErrorJob)

  // await scheduler.schedule('every 5 minutes', new ExampleJob)
  
  // await scheduler.schedule('every day 16:00', new AnotherJob)

  await jobz.start()

  app.use('/jobz', JobzDash(jobz))
  app.listen(3000)
})()
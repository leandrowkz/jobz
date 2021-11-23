import { Job } from '../src'
import axios, { AxiosInstance } from 'axios'

export class TMDBFetcherJob implements Job {
  public name: string = 'the-movie-database-fetcher'
  public http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      timeout: 10000,
      params: {
        api_key: 'd4899cc41d03d73eab75aa8f7ce36ab5'
      }
    });
  }

  public async handle(): Promise<void> {
    console.log(`Starting job ${this.name}...`)
    
    const movieId = Math.floor(Math.random() * (1200 - 1 + 1)) + 1;
    console.log(`Attempting to fetch movie ID ${movieId} data from https://themoviedatabase.org`)

    const response = await this.http.get(`/movie/${movieId}`)
    
    if (response.status === 200) {
      console.log(response.data)
    } else {
      throw Error(response.statusText)
    }
  }
}
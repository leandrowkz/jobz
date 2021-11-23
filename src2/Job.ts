export interface Job {
  name: string
  handle(): Promise<void>
}

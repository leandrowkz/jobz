export interface Job {
  handle(params: Record<string, any>): Promise<void>
}

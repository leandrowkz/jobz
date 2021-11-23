type Jobs = {
  [key: string]: {
    name: string,
    file: string,
  }
}

export class JobRegister {
  protected jobs: Jobs = {}

  public async register(jobName: string, jobPath: string) {
    this.jobs[jobName] = {
      name: jobName,
      file: jobPath,
    }
  }
}

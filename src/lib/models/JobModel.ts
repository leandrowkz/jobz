import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { JobStatus } from '../types';

@Entity({ name: 'Jobs' })
export class JobModel extends BaseEntity {
  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ObjectIdColumn()
  id!: ObjectID

  @Column()
  name!: string

  @Column({ default: JobStatus.Enabled })
  status!: JobStatus;

  @Column({ default: [] })
  labels!: string[]

  @Column({ default: false })
  hasHandler!: boolean;

  @Column({ default: [] })
  scheduleRules!: string[]

  @Column({ default: 0 })
  runningCount!: number

  @Column({ default: 0 })
  maxConcurrency!: number

  @Column()
  lastRunAt!: Date;

  static async findByName(name: string): Promise<JobModel | undefined> {
    return this.findOne({ name })
  }
}
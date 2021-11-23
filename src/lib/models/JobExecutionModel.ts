import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { JobExecutionStatus, JobExecutionTrigger } from '../types';
import { JobModel } from './JobModel';

@Entity({ name: 'JobsExecution' })
export class JobExecutionModel extends BaseEntity {
  static QUERY_COLUMNS: (keyof JobExecutionModel)[] = [
    'id',
    'name',
    'status',
    'trigger',
    'scheduleRule',
    'startedAt',
    'finishedAt',
  ]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ObjectIdColumn()
  id!: ObjectID

  @Column()
  name!: string

  @Column()
  scheduleRule!: string

  @Column({ default: {} })
  params!: Record<string, any>

  @Column({ default: JobExecutionTrigger.Schedule })
  trigger!: JobExecutionTrigger

  @Column({ default: JobExecutionStatus.Stucked })
  status!: JobExecutionStatus;

  @Column()
  startedAt!: Date;

  @Column()
  finishedAt?: Date;

  @Column()
  durationMs?: number;

  @Column({ default: 0 })
  retries!: number;

  @Column({ select: false, default: '' })
  output?: string;

  @Column()
  failReason?: string;

  @Column()
  job?: JobModel;
}

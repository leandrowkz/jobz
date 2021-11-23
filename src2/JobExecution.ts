import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm'
import { EJobResult } from './EJobResult';
import { EJobStatus } from './EJobStatus';

@Entity()
export class JobExecution {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  jobName!: string;

  @Column()
  status!: EJobStatus;

  @Column()
  result!: EJobResult;

  @Column()
  startedAt!: Date;

  @Column()
  finishedAt?: Date;

  @Column()
  durationMs?: number;

  @Column()
  output?: string;

  @Column()
  errorReason?: string;
}
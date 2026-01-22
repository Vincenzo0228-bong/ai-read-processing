import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type StepStatus =
  | 'not_started'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'skipped';

@Entity('workflow_steps')
export class WorkflowStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workflowId: string;

  @Column()
  stepType: string;

  @Column({ default: 'not_started' })
  status: StepStatus;

  @Column({ type: 'jsonb', nullable: true })
  output?: any;

  @Column({ nullable: true })
  error: string;

  @CreateDateColumn()
  createdAt: Date;
}

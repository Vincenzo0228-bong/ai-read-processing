import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type WorkflowStatus =
  | 'pending'
  | 'running'
  | 'processing'
  | 'completed'
  | 'failed';

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

  @Column()
  userId: string;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: WorkflowStatus;

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;

  @Column({ nullable: true })
  error: string;

  @CreateDateColumn()
  createdAt: Date;
}

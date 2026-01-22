import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  userId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  contactChannel: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}

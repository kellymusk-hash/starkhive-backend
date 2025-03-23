import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Milestone } from './milestone.entity';
import { Deliverable } from './deliverable.entity';
import { Task } from './task.entity';
import { FileAttachment } from './file-attachment.entity';
import { TimeLog } from './time-log.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', default: 0 })
  budget: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  currency: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'project_manager_id' })
  projectManager: User;

  @Column({ name: 'project_manager_id', nullable: true })
  projectManagerId: string;

  @OneToMany(() => Milestone, (milestone) => milestone.project, {
    cascade: true,
  })
  milestones: Milestone[];

  @OneToMany(() => Deliverable, (deliverable) => deliverable.project, {
    cascade: true,
  })
  deliverables: Deliverable[];

  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
  })
  tasks: Task[];

  @OneToMany(() => FileAttachment, (file) => file.project, {
    cascade: true,
  })
  files: FileAttachment[];

  @OneToMany(() => TimeLog, (timeLog) => timeLog.project, {
    cascade: true,
  })
  timeLogs: TimeLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
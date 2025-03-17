import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event: string;

  @Column()
  reference: string;

  @Column({ type: 'text' })
  payload: string;

  @CreateDateColumn()
  createdAt: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('callback_logs')
export class CallbackLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  error: string;

  @CreateDateColumn()
  createdAt: Date;
}

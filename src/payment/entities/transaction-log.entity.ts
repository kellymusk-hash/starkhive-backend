import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transaction_logs')
export class TransactionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true, unique: true })
  reference: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column({ nullable: true, type: 'text' })
  metadata: string;

  @Column({ nullable: true, type: 'timestamp' })
  paymentDate: Date;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
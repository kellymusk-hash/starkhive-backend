import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class JobPosting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'decimal', nullable: true })
  salary?: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Policy } from '../policy/policy.entity';
import { UserConsent } from '../user-censent/user-censent.entity';

@Entity('policy_versions')
export class PolicyVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  versionNumber: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isCurrentVersion: boolean;

  @Column({ type: 'timestamp', nullable: true })
  effectiveDate: Date;

  @ManyToOne(() => Policy, (policy) => policy.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'policyId' })
  policy: Policy;

  @Column()
  policyId: string;

  @OneToMany(() => UserConsent, (consent) => consent.policyVersion)
  userConsents: UserConsent[];

  @CreateDateColumn()
  createdAt: Date;
}

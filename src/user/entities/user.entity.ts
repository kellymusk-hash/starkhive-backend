import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Contract } from 'src/contract/entities/contract.entity';
import { NotificationSettings } from 'src/notification-settings/entities/notification-settings.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { OneToOne } from 'typeorm';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity('users')
@Index(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  @IsNotEmpty()
  @Length(3, 20)
  username?: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  @IsEmail()
  password: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  walletAddress?: string;

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts?: Contract[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments?: Payment[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
  @OneToMany(() => NotificationSettings, (notification) => notification.user)
  notificationSettings: NotificationSettings[];

  @IsBoolean()
  isEmailVerified: boolean;

  @IsString()
  emailTokenVerification?: string;

  @IsBoolean()
  resetToken: string;

  @IsDate()
  tokenExpires: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne(
    () => FreelancerProfile,
    (freelancerProfile) => freelancerProfile.user,
    { cascade: true },
  )
  freelancerProfile?: FreelancerProfile;

  // Add OAuth fields
  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  name?: string; // Add the `name` field

  @Column({ nullable: true })
  githubId?: string;

  @Column({ nullable: true })
  linkedinId?: string;
}

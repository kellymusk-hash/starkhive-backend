import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Project } from '@src/project/entities/project.entity';
import { FreelancerPortfolioProject } from './freelancer-portfolio.entity'; // Ensure this import is correct

@Entity('freelancer_profiles')
export class FreelancerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.freelancerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { array: true, default: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills: string[];

  @Column('text')
  @IsNotEmpty()
  @IsString()
  experience: string;

  @Column('text', { array: true, default: [] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  portfolioLinks: string[];

  @OneToMany(
    () => FreelancerPortfolioProject,
    (portfolioProject) => portfolioProject.profile,
    { cascade: true, eager: true }, // Add eager loading if needed
  )
  portfolioProjects: FreelancerPortfolioProject[];

  @OneToMany(() => Project, (project) => project.freelancer)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

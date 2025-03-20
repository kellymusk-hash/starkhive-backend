import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsUrl } from 'class-validator';

@Entity('freelancer_profiles')
export class FreelancerProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.freelancerProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })  // Ensures this is the owner side
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

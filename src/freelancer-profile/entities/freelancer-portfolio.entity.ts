import { IsArray } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "src/user/entities/user.entity";
import { Testimonial } from "./testimonial.entity";
import { FreelancerProfile } from "./freelancer-profile.entity";

export enum ProjectVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
    LIMITED = 'limited'
}

@Entity('freelancer_portfolio_project')
export class FreelancerPortfolioProject {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => FreelancerProfile, (profile) => profile.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    profile: FreelancerProfile

    @Column({ type: 'uuid' })
    profileId: string;

    @Column()
    projectDescription: string;

    @Column('bytea', { array: true, default: [] })
    @IsArray()
    mediaBuffer: Buffer;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column('simple-array', { nullable: true })
    tags: string[];

    @Column({ type: 'enum', enum: ProjectVisibility, default: ProjectVisibility.PUBLIC })
    visibility: ProjectVisibility;

    @Column()
    testimonials: Testimonial[];

    @Column({ type: 'int', default: 0 })
    views: number;

    @Column({ type: 'timestamptz', nullable: true })
    lastViewedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
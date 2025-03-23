import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity'; // Assuming there's a User entity

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, user => user.conversations)
    @JoinTable()
    participants: User[];

    @Column('text', { array: true, default: [] })
    messageHistory: string[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;
}
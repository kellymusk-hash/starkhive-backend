import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
//   import { User } from '../../user/entities/user.entity';
  
  @Entity()
  export class Company {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column({ nullable: true })
    website: string;
  
    @Column({ nullable: true })
    walletAddress: string;
  
    // @ManyToOne(() => User, (user) => user.companies, { onDelete: 'CASCADE' })
    // owner: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  
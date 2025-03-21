import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class JobNotification{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    /**the user to notify of notifications */
    userId:number

    @Column()
    type:string

    @Column()
    message:string

    
    @Column({ default: false })
    read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class NotificationSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.notificationSettings, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: true })
  email: boolean;

  @Column({ default: true })
  sms: boolean;

  @Column({ default: true })
  push: boolean;
}


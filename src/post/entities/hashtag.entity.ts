import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Post } from "./post.entity"

@Entity("hashtags")
export class Hashtag {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  name: string

  @Column({ default: 0 })
  postCount: number

  @ManyToMany(
    () => Post,
    (post) => post.hashtags,
  )
  posts: Post[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}


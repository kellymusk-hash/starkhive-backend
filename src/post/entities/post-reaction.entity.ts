import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from "typeorm"
import { Post } from "./post.entity"
import { User } from "src/user/entities/user.entity"


export enum ReactionType {
  LIKE = "like",
  CELEBRATE = "celebrate",
  SUPPORT = "support",
  LOVE = "love",
  INSIGHTFUL = "insightful",
  CURIOUS = "curious",
}

@Entity("post_reactions")
@Unique(["postId", "userId", "type"])
export class PostReaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "enum", enum: ReactionType })
  type: ReactionType

  @ManyToOne(
    () => Post,
    (post) => post.reactions,
  )
  @JoinColumn({ name: "post_id" })
  post: Post

  @Column({ name: "post_id" })
  postId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User

  @Column({ name: "user_id" })
  userId: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}


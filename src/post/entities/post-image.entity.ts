import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Post } from "./post.entity"

@Entity("post_images")
export class PostImage {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  url: string

  @Column({ nullable: true })
  caption: string

  @Column({ nullable: true })
  altText: string

  @Column({ type: "integer" })
  order: number

  @ManyToOne(
    () => Post,
    (post) => post.images,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "post_id" })
  post: Post

  @Column({ name: "post_id" })
  postId: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}


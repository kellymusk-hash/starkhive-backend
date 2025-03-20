import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
  } from "typeorm"
  import { PostReaction } from "./post-reaction.entity"
  import { PostImage } from "./post-image.entity"
  import { Hashtag } from "./hashtag.entity"
import { User } from "src/user/entities/user.entity"
  
  export enum PostPrivacy {
    PUBLIC = "public",
    CONNECTIONS = "connections",
    PRIVATE = "private",
  }
  
  @Entity("posts")
  export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string
  
    @Column({ type: "text" })
    content: string
  
    @Column({ type: "json", nullable: true })
    metadata: {
      links: { url: string; title: string; description: string; image: string }[]
      mentions: string[]
    }
  
    @Column({ type: "enum", enum: PostPrivacy, default: PostPrivacy.PUBLIC })
    privacy: PostPrivacy
  
    @ManyToOne(
      () => User,
      (user) => user.posts,
    )
    @JoinColumn({ name: "author_id" })
    author: User
  
    @Column({ name: "author_id" })
    authorId: string
  
    @OneToMany(
      () => PostReaction,
      (reaction) => reaction.post,
    )
    reactions: PostReaction[]
  
    @OneToMany(
      () => PostImage,
      (image) => image.post,
      { cascade: true },
    )
    images: PostImage[]
  
    @ManyToMany(
      () => Hashtag,
      (hashtag) => hashtag.posts,
    )
    @JoinTable({
      name: "post_hashtags",
      joinColumn: { name: "post_id", referencedColumnName: "id" },
      inverseJoinColumn: { name: "hashtag_id", referencedColumnName: "id" },
    })
    hashtags: Hashtag[]
  
    @ManyToOne(() => Post, { nullable: true })
    @JoinColumn({ name: "original_post_id" })
    originalPost: Post
  
    @Column({ name: "original_post_id", nullable: true })
    originalPostId: string
  
    @OneToMany(
      () => Post,
      (post) => post.originalPost,
    )
    reposts: Post[]
  
    @Column({ default: 0 })
    reactionCount: number
  
    @Column({ default: 0 })
    commentCount: number
  
    @Column({ default: 0 })
    repostCount: number
  
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
  }
  
  
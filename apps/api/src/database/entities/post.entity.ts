import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum PostVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

@Entity({ name: "posts" })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "author_id" })
  authorId!: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author!: User;

  @Column()
  title!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "enum", enum: PostVisibility, default: PostVisibility.PUBLIC })
  visibility!: PostVisibility;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

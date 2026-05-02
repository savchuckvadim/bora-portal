import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  USER = "user",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ name: "keycloak_sub", nullable: true, unique: true })
  keycloakSub!: string | null;

  @Column({ name: "matrix_user_id", nullable: true, unique: true })
  matrixUserId!: string | null;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

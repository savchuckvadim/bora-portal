import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum RoomEntityType {
  DEPARTMENT = "department",
  PROJECT = "project",
  TICKET = "ticket",
  POST = "post",
}

@Entity({ name: "room_links" })
export class RoomLink {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "entity_type", type: "enum", enum: RoomEntityType })
  entityType!: RoomEntityType;

  @Column({ name: "entity_id" })
  entityId!: string;

  @Column({ name: "matrix_room_id", unique: true })
  matrixRoomId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

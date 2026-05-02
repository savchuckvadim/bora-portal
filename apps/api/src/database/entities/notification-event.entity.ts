import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
}

@Entity({ name: "notification_events" })
export class NotificationEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  type!: string;

  @Column({ name: "payload_json", type: "jsonb" })
  payloadJson!: Record<string, unknown>;

  @Column({ default: NotificationStatus.PENDING })
  status!: NotificationStatus;

  @Column({ default: 0 })
  retries!: number;

  @Column({ name: "correlation_id" })
  correlationId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

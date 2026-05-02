import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import {
  NotificationEvent,
  NotificationStatus,
} from "../../database/entities/notification-event.entity";
import { RoomEntityType, RoomLink } from "../../database/entities/room-link.entity";
import { MatrixAdminService } from "../matrix/matrix-admin.service";

@Injectable()
export class NotificationEventsService {
  constructor(
    @InjectRepository(NotificationEvent)
    private readonly eventRepo: Repository<NotificationEvent>,
    @InjectRepository(RoomLink)
    private readonly roomLinkRepo: Repository<RoomLink>,
    private readonly matrixAdminService: MatrixAdminService,
  ) {}

  enqueueEvent(type: string, payloadJson: Record<string, unknown>): Promise<NotificationEvent> {
    return this.eventRepo.save(
      this.eventRepo.create({
        type,
        payloadJson,
        status: NotificationStatus.PENDING,
        retries: 0,
        correlationId: randomUUID(),
      }),
    );
  }

  @Cron("*/20 * * * * *")
  async processPending(): Promise<void> {
    const pending = await this.eventRepo.find({
      where: { status: NotificationStatus.PENDING },
      order: { createdAt: "ASC" },
      take: 20,
    });

    for (const event of pending) {
      try {
        await this.dispatchEvent(event);
        event.status = NotificationStatus.SENT;
      } catch (_error) {
        event.status = NotificationStatus.FAILED;
        event.retries += 1;
      }
      await this.eventRepo.save(event);
    }
  }

  private async dispatchEvent(event: NotificationEvent): Promise<void> {
    if (event.type === "POST_CREATED") {
      const postId = String(event.payloadJson.postId ?? "");
      const roomLink = await this.roomLinkRepo.findOne({
        where: { entityType: RoomEntityType.POST, entityId: postId },
      });
      if (!roomLink) {
        return;
      }
      const title = String(event.payloadJson.title ?? "New post");
      await this.matrixAdminService.sendMessage(roomLink.matrixRoomId, `Новый пост: ${title}`);
    }
  }
}

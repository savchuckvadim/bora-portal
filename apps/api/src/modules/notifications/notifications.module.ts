import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEvent } from "../../database/entities/notification-event.entity";
import { RoomLink } from "../../database/entities/room-link.entity";
import { MatrixModule } from "../matrix/matrix.module";
import { NotificationEventsService } from "./notification-events.service";
import { NotificationsController } from "./notifications.controller";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEvent, RoomLink]), MatrixModule],
  providers: [NotificationEventsService],
  controllers: [NotificationsController],
  exports: [NotificationEventsService],
})
export class NotificationsModule {}

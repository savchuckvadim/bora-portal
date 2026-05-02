import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { NotificationEventsService } from "./notification-events.service";

class PostCreatedNotificationDto {
  @IsString()
  postId!: string;

  @IsString()
  title!: string;

  @IsString()
  authorId!: string;
}

class GenericNotificationDto {
  @IsString()
  type!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationEventsService) {}

  @Post("post-created")
  postCreated(@Body() dto: PostCreatedNotificationDto) {
    return this.notificationsService.enqueueEvent("POST_CREATED", {
      postId: dto.postId,
      title: dto.title,
      authorId: dto.authorId,
    });
  }

  @Post("event")
  enqueue(@Body() dto: GenericNotificationDto) {
    return this.notificationsService.enqueueEvent(dto.type, dto.payload);
  }
}

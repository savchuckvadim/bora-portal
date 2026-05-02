import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../../database/entities/post.entity";
import { NotificationsModule } from "../notifications/notifications.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), NotificationsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

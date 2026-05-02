import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEvent } from "./database/entities/notification-event.entity";
import { Post } from "./database/entities/post.entity";
import { RoomLink } from "./database/entities/room-link.entity";
import { User } from "./database/entities/user.entity";
import { AuthModule } from "./modules/auth/auth.module";
import { MatrixModule } from "./modules/matrix/matrix.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PostsModule } from "./modules/posts/posts.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("APP_DB_HOST", "localhost"),
        port: Number(config.get("APP_DB_PORT", 5432)),
        username: config.get("APP_DB_USER", "portal"),
        password: config.get("APP_DB_PASSWORD", "portal"),
        database: config.get("APP_DB_NAME", "portal"),
        entities: [User, Post, RoomLink, NotificationEvent],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    MatrixModule,
    NotificationsModule,
  ],
})
export class AppModule {}

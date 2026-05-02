import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomLink } from "../../database/entities/room-link.entity";
import { User } from "../../database/entities/user.entity";
import { MatrixController } from "./matrix.controller";
import { MatrixAdminService } from "./matrix-admin.service";
import { MatrixProvisioningService } from "./matrix-provisioning.service";
import { MatrixRoomService } from "./matrix-room.service";
import { MatrixSessionService } from "./matrix-session.service";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, RoomLink])],
  controllers: [MatrixController],
  providers: [MatrixAdminService, MatrixProvisioningService, MatrixRoomService, MatrixSessionService],
  exports: [MatrixAdminService, MatrixProvisioningService, MatrixRoomService, MatrixSessionService],
})
export class MatrixModule {}

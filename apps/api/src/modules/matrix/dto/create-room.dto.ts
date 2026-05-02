import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { RoomEntityType } from "../../../database/entities/room-link.entity";

export class CreateRoomDto {
  @ApiProperty({ enum: RoomEntityType })
  @IsEnum(RoomEntityType)
  entityType!: RoomEntityType;

  @ApiProperty()
  @IsUUID()
  entityId!: string;

  @ApiProperty()
  @IsString()
  name!: string;
}

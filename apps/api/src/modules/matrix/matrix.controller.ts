import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateRoomDto } from "./dto/create-room.dto";
import { MatrixRoomService } from "./matrix-room.service";
import { MatrixSessionService } from "./matrix-session.service";

@ApiTags("matrix")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("matrix")
export class MatrixController {
  constructor(
    private readonly matrixRoomService: MatrixRoomService,
    private readonly matrixSessionService: MatrixSessionService,
  ) {}

  @Post("rooms")
  createRoom(@Body() dto: CreateRoomDto) {
    return this.matrixRoomService.ensureRoomForEntity(dto.entityType, dto.entityId, dto.name);
  }

  @Get("rooms")
  listRooms() {
    return this.matrixRoomService.findAllLinks();
  }

  @Post("session/me")
  createSession(@CurrentUser() user: AuthUser) {
    return this.matrixSessionService.createSessionForKeycloakSub(user.sub);
  }
}

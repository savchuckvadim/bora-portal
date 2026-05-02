import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoomEntityType, RoomLink } from "../../database/entities/room-link.entity";
import { MatrixAdminService } from "./matrix-admin.service";

@Injectable()
export class MatrixRoomService {
  constructor(
    @InjectRepository(RoomLink) private readonly roomLinkRepo: Repository<RoomLink>,
    private readonly matrixAdminService: MatrixAdminService,
  ) {}

  async ensureRoomForEntity(
    entityType: RoomEntityType,
    entityId: string,
    name: string,
  ): Promise<RoomLink> {
    const existing = await this.roomLinkRepo.findOne({ where: { entityType, entityId } });
    if (existing) {
      return existing;
    }
    const matrixRoomId = await this.matrixAdminService.createRoom(name);
    const link = this.roomLinkRepo.create({ entityType, entityId, matrixRoomId });
    return this.roomLinkRepo.save(link);
  }

  findAllLinks(): Promise<RoomLink[]> {
    return this.roomLinkRepo.find({ order: { createdAt: "DESC" } });
  }
}

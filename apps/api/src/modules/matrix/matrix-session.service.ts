import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { MatrixAdminService } from "./matrix-admin.service";
import { MatrixProvisioningService } from "./matrix-provisioning.service";

@Injectable()
export class MatrixSessionService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly matrixAdminService: MatrixAdminService,
    private readonly matrixProvisioningService: MatrixProvisioningService,
  ) {}

  async createSessionForKeycloakSub(keycloakSub: string) {
    const user = await this.usersRepo.findOne({ where: { keycloakSub } });
    if (!user) {
      throw new UnauthorizedException("Unknown portal user");
    }
    const provisioned = await this.matrixProvisioningService.ensureUserProvisioned(user);
    const accessToken = await this.matrixAdminService.loginWithPassword(provisioned.matrixUserId);
    return {
      userId: provisioned.matrixUserId,
      accessToken,
    };
  }
}

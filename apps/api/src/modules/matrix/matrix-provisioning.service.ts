import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { MatrixAdminService } from "./matrix-admin.service";

@Injectable()
export class MatrixProvisioningService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly matrixAdminService: MatrixAdminService,
  ) {}

  async ensureUserProvisioned(user: User): Promise<{ matrixUserId: string }> {
    if (user.matrixUserId) {
      return { matrixUserId: user.matrixUserId };
    }
    const localPart = user.email.split("@")[0].replace(/[^a-zA-Z0-9_.=-]/g, "-");
    const matrixUserId = await this.matrixAdminService.registerUser(localPart, user.name);
    user.matrixUserId = matrixUserId;
    await this.usersRepo.save(user);
    return { matrixUserId };
  }
}

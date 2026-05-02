import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { MatrixProvisioningService } from "../matrix/matrix-provisioning.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly matrixProvisioningService: MatrixProvisioningService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    const saved = await this.usersRepo.save(user);
    const provisioned = await this.matrixProvisioningService.ensureUserProvisioned(saved);
    return this.usersRepo.save({ ...saved, matrixUserId: provisioned.matrixUserId });
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find({ order: { createdAt: "DESC" } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }

  async upsertFromOidc(data: {
    keycloakSub: string;
    email: string;
    name: string;
  }): Promise<User> {
    let user = await this.usersRepo.findOne({ where: { keycloakSub: data.keycloakSub } });
    if (!user) {
      user = this.usersRepo.create({
        email: data.email,
        name: data.name,
        keycloakSub: data.keycloakSub,
      });
    } else {
      user.email = data.email;
      user.name = data.name;
    }
    const saved = await this.usersRepo.save(user);
    if (!saved.matrixUserId) {
      const matrix = await this.matrixProvisioningService.ensureUserProvisioned(saved);
      saved.matrixUserId = matrix.matrixUserId;
      return this.usersRepo.save(saved);
    }
    return saved;
  }
}

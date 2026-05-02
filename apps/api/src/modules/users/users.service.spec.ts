import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { MatrixProvisioningService } from "../matrix/matrix-provisioning.service";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: { create: jest.fn(), save: jest.fn() } },
        {
          provide: MatrixProvisioningService,
          useValue: { ensureUserProvisioned: jest.fn().mockResolvedValue({ matrixUserId: "@u:matrix.local" }) },
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    repo = moduleRef.get(getRepositoryToken(User));
  });

  it("creates user and sets matrix mapping", async () => {
    const dto = { email: "u@e.co", name: "U" };
    repo.create.mockReturnValue(dto as User);
    repo.save.mockResolvedValueOnce({ id: "id-1", ...dto, matrixUserId: null } as User);
    repo.save.mockResolvedValueOnce({ id: "id-1", ...dto, matrixUserId: "@u:matrix.local" } as User);

    const result = await service.create(dto as any);

    expect(result.matrixUserId).toBe("@u:matrix.local");
  });
});

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post("sync/me")
  syncFromOidc(@CurrentUser() user: AuthUser) {
    return this.usersService.upsertFromOidc({
      keycloakSub: user.sub,
      email: user.email ?? `${user.sub}@local.invalid`,
      name: user.name ?? "Portal User",
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.usersService.remove(id);
    return { success: true };
  }
}

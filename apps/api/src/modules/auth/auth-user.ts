import { UserRole } from "../../database/entities/user.entity";

export interface AuthUser {
  sub: string;
  email?: string;
  name?: string;
  role: UserRole;
}

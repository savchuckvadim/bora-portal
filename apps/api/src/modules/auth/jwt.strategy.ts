import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";
import { UserRole } from "../../database/entities/user.entity";
import { AuthUser } from "./auth-user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const issuer = config.get<string>("KEYCLOAK_ISSUER");
    const audience = config.get<string>("KEYCLOAK_AUDIENCE", "portal-api");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience,
      issuer,
      algorithms: ["RS256"],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
      }) as any,
    });
  }

  validate(payload: Record<string, unknown>): AuthUser {
    const realmAccess = payload.realm_access as { roles?: string[] } | undefined;
    const roleFromToken = realmAccess?.roles?.includes("admin")
      ? UserRole.ADMIN
      : realmAccess?.roles?.includes("editor")
        ? UserRole.EDITOR
        : UserRole.USER;
    return {
      sub: String(payload.sub),
      email: payload.email ? String(payload.email) : undefined,
      name: payload.name ? String(payload.name) : undefined,
      role: roleFromToken ?? UserRole.USER,
    };
  }
}

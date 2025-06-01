// src/auth/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "yourJwtSecret",
    });
  }

  // `payload` is whatever you signed in AuthService.login()
  async validate(payload: any) {
    // At minimum, return an object with { id, email, role } (so that
    // `req.user` is populated for controllers)
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

// src/auth/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request }    from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [bearer, token] = auth.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Malformed Authorization header');
    }

    let payload: any;
    try {
      // verify returns your original payload { sub, email, role }
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Coerce sub → number, reject if it isn't valid
    const rawSub = payload.sub;
    const userId = typeof rawSub === 'string'
      ? parseInt(rawSub, 10)
      : rawSub;

    if (typeof userId !== 'number' || isNaN(userId)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Attach a clean user object
    (req as any).user = {
      sub:  userId,
      id:   userId,
      email: payload.email,
      role:  payload.role,
    };

    return true;
  }
}

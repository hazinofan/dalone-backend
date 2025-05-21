// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user?.password) return null;
    const match = await bcrypt.compare(pass, user.password);
    return match ? (({ password, ...u }) => u)(user) : null;
  }

  async login(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwt.sign(payload),
      user: payload,
    };
  }

  async signInWithGoogle(idToken: string) {
    // 1) Vérifier l’ID token auprès de Google
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const email = payload.email!;
    // 2) Créer ou récupérer l’utilisateur en base (role par défaut “client”)
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        password: null,
      });
    }

    // 3) Générer et retourner votre propre JWT
    const jwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwt.sign(jwtPayload),
      user: jwtPayload,
    };
  }
}

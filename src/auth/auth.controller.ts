import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    const access_token = await this.authService.login(user);
    return { access_token, role: user.role };
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }
    return this.authService.login(user);
  }

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    return this.authService.signInWithGoogle(idToken);
  }
}

import { Controller, Post, Body, UnauthorizedException, ConflictException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,  private readonly usersService: UsersService,) { }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const existingUser = await this.authService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

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

 @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Could not extract user from token');
    }

    // 1) Load the fresh user from DB (so we see updated role)
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // 2) Sign a new JWT with user.role (which may have changed)
    const newJwt = await this.authService.signToken(user);
    return { access_token: newJwt };
  }
}

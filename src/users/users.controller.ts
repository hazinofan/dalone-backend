// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // ── PROTECTED PROFILE ────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    console.log('[GET /users/me] req.user =', req.user);

    // ← grab whichever you returned in your strategy:
    const raw = req.user?.id ?? req.user?.sub;
    const userId = typeof raw === 'string' ? parseInt(raw, 10) : raw;

    if (typeof userId !== 'number' || isNaN(userId)) {
      throw new UnauthorizedException('Invalid user id in token');
    }

    return this.usersService.findById(userId);
  }

  // ── PUBLIC ID ROUTES ─────────────────────────────────────────────────────────
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: 'client' | 'professional',
  ) {
    // validate incoming role
    if (!['client', 'professional'].includes(role)) {
      throw new BadRequestException(`Invalid role "${role}"`);
    }
    return this.usersService.updateRole(id, role);
  }
}

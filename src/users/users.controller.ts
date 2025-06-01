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
import { JwtOptionalGuard } from 'src/auth/jwt-optional.guard';

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
  @Get("me")
  @UseGuards(JwtAuthGuard) // or AuthGuard("jwt") if you made a Passport-based guard
  async getProfile(@Req() req: any) {
    // At this point, JwtAuthGuard has already verified and 
    // put { id, email, role } into req.user.
    return req.user;
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

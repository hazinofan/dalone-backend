// src/client-profile/client-profile.controller.ts
import { Controller, Post, Get, Body, Req, UseGuards, Patch, BadRequestException } from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';

@Controller('client-profile')
export class ClientProfileController {
  constructor(private svc: ClientProfileService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() dto: CreateClientProfileDto) {
    return this.svc.create(req.user.sub, dto);
  }

  @Get()
  getMine(@Req() req) {
    return this.svc.findByUserId(req.user.sub);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() dto: UpdateClientProfileDto) {
    const userId = req.user.sub;
    const existing = await this.svc.findByUserId(userId);
    if (!existing) {
      throw new BadRequestException('Client profile does not exist');
    }
    return this.svc.updateByUserId(userId, dto);
  }

}

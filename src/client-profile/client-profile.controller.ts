// src/client-profile/client-profile.controller.ts
import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('client-profile')
export class ClientProfileController {
  constructor(private svc: ClientProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() dto: CreateClientProfileDto) {
    return this.svc.create(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMine(@Req() req) {
    return this.svc.findByUserId(req.user.sub);
  }
}

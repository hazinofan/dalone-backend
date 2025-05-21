// src/professional-profile/professional-profile.controller.ts
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ProfessionalProfileService } from './professional-profile.service';
import { CreateProfessionalProfileDto } from './dto/create-professional-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('professional-profile')
@UseGuards(JwtAuthGuard)
export class ProfessionalProfileController {
  constructor(private readonly profileService: ProfessionalProfileService) {}

  /** GET /professional-profile/me */
  @Get('me')
  async getMine(@Req() req: any) {
    const userId = req.user.id;
    return this.profileService.findByUserId(userId);
  }

  /** POST /professional-profile/me */
  @Post('me')
  async upsert(@Req() req: any, @Body() dto: CreateProfessionalProfileDto) {
    const userId = req.user.id;
    return this.profileService.upsertProfile(userId, dto);
  }
}

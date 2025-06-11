import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('client-profile')
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: CreateClientProfileDto) {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException('Authenticated user not found');
    }
    return this.clientProfileService.create(userId, dto);
  }

  // Optional: fetch client profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req) {
    const userId = req.user?.id;
    return this.clientProfileService.findByUserId(userId);
  }

  // Optional: update profile
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Req() req, @Body() dto: Partial<CreateClientProfileDto>) {
    const userId = req.user?.id;
    return this.clientProfileService.update(userId, dto);
  }
}

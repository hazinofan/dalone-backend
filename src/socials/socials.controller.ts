// socials.controller.ts

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Body,
  Delete,
  Put,
  HttpCode,
  Post,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SocialsService } from './socials.service';
import { SocialLink } from './entities/social.entity';

@Controller('socials')
export class SocialsController {
  constructor(private readonly socials: SocialsService) { }

  // ◼ PUBLIC – fetch any user's socials by their user‐id
  @Get(':userId')
  getPublic(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.socials.findAllForUser(userId);
  }

  // ◼ PROTECTED – fetch the signed-in user's own socials
  @UseGuards(JwtAuthGuard)
  @Get()
  getMine(@Req() req) {
    return this.socials.findAllForUser(req.user.id);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  createOne(
    @Req() req,
    @Body() dto: { platform: string; username?: string; url?: string }
  ) {
    return this.socials.createForUser(req.user.id, dto);
  }

  // ◼ PROTECTED – bulk upsert
  @UseGuards(JwtAuthGuard)
  @Put()
  saveAll(
    @Req() req,
    @Body('links') links: Partial<SocialLink>[],
  ) {
    return this.socials.upsertForUser(req.user.id, links);
  }

  // ◼ PROTECTED – delete one
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.socials.removeOne(req.user.id, id);
  }

  //PATCH THE FUCKING SOCIAL 
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<SocialLink>,
  ) {
    return this.socials.patchForUser(req.user.id, id, dto);
  }
}

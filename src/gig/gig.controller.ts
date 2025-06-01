import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { GigService } from './gig.service';
import { Gig } from './entities/gig.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('gigs')
export class GigController {
  constructor(private readonly gigService: GigService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() gigData: Partial<Gig>) {
    return this.gigService.create(gigData);
  }

  @Get()
  findAll() {
    return this.gigService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.gigService.findByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gigService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Gig>) {
    return this.gigService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gigService.delete(+id);
  }
}
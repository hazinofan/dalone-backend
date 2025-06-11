import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AvailabilityService } from "./availability.service";
import { CreateAvailabilityDto, UpdateAvailabilityDto } from "./dto/create-availability.dto";

// src/availability/availability.controller.ts
@UseGuards(JwtAuthGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAvailabilityDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  findMine(@Req() req) {
    return this.service.findAllForUser(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}

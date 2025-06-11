import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CreateReservationDto, UpdateReservationStatusDto } from "./dto/create-reservation.dto";
import { ReservationService } from "./reservation.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) { }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateReservationDto) {
    return this.service.create(req.user.id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyReservations(@Req() req) {
    return this.service.getByClient(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('professional')
  getForProfessional(@Req() req) {
    return this.service.getByProfessional(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReservationStatusDto) {
    return this.service.updateStatus(+id, dto.status);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }

  @Get('available')
  getAvailableSlots(
    @Query('professionalId') professionalId: string,
    @Query('weekStart') weekStart: string
  ) {
    return this.service.getAvailableSlots(+professionalId, weekStart);
  }
}

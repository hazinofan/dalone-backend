import { Controller, Get, Patch, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  findMyNotifications(@Req() req) {
    return this.notificationsService.findForUser(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.notificationsService.delete(id);
  }
}

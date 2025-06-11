import { Controller, Get, Patch, Delete, Param, UseGuards, Req, Body, Post, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('me')
  findMyNotifications(@Req() req) {
    return this.notificationsService.findForUser(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.delete(id);
  }


  @Post('message')
  async createMessageNotification(
    @Body('recipientId', ParseIntPipe) recipientId: number,
    @Body('senderId', ParseIntPipe) senderId: number,
    @Body('snippet') snippet: string,
  ) {
    // At this point, `recipientId` and `senderId` are guaranteed to be numbers,
    // or Nest has already thrown a 400 if it could not parse them to int.
    console.log('[NotificationsController] got message‐notif:', {
      recipientId,
      senderId,
      snippet,
    });

    const created = await this.notificationsService.createMessageNotificationOncePerHour(
      recipientId,
      senderId,
      snippet,
    );

    return {
      created: created !== null,
      notification: created,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(userId: number, type: string, message: string, meta: any = {}) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return;

    const notification = this.notificationRepo.create({
      user,
      type,
      message,
      meta,
    });

    return this.notificationRepo.save(notification);
  }

  async createMessageNotificationOncePerHour(
    recipientId: number,
    senderId: number,
    snippet: string,
  ): Promise<Notification | null> {
    // 1) Fetch the recipient user
    const recipient = await this.userRepo.findOneBy({ id: recipientId });
    if (!recipient) {
      this.logger.warn(
        `Cannot create message notification: recipient ${recipientId} not found.`,
      );
      return null;
    }

    // 2) Compute “one hour ago”
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // 3) Look for any existing “message” notification from this sender→recipient in the last hour
    const existing = await this.notificationRepo.findOne({
      where: {
        user: { id: recipientId },
        senderId: senderId,
        type: 'message',
        createdAt: MoreThan(oneHourAgo),
      },
    });

    if (existing) {
      // If found, skip creating a new notification
      this.logger.debug(
        `Throttled: existing message-notif [id=${existing.id}] from sender=${senderId} → recipient=${recipientId} at ${existing.createdAt}`,
      );
      return null;
    }

    // 4) Otherwise, build and save a fresh “message” notification
    const newNotif = this.notificationRepo.create({
      user: recipient,
      senderId: senderId,
      type: 'message',
      message: snippet,
      isRead: false,
      meta: null,
    });

    const saved = await this.notificationRepo.save(newNotif);
    this.logger.log(
      `Created new message-notif [id=${saved.id}] from sender=${senderId} → recipient=${recipientId}.`,
    );
    return saved;
  }


  async findForUser(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number) {
    return this.notificationRepo.update(id, { isRead: true });
  }

  async delete(id: number) {
    return this.notificationRepo.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

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

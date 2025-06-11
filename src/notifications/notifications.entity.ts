// notifications/notifications.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity'; // ← adjust if your path differs

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The user who will receive this notification.
   * (For “follow” notifications, this is the professional being followed.
   * For “message” notifications, this is the message recipient.)
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  /**
   * If type = 'message', this is the userId of the sender.
   * Otherwise (e.g. type = 'follow'), this stays null.
   */
  @Column({ type: 'int', nullable: true })
  senderId: number | null;

  /** e.g. 'follow', 'message', 'booking', etc. */
  @Column({ length: 30 })
  type: string;

  /** The human-readable message, e.g. “Alice started following you.” or a text snippet. */
  @Column({ type: 'varchar', length: 255 })
  message: string;

  /** Has the user already read (or dismissed) this notification? */
  @Column({ default: false })
  isRead: boolean;

  /** Automatically set to the current timestamp when the row is inserted */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Any extra data you want to store. For a “follow” notification you might do:
   *    meta = { followerId: 123 }
   * For a “message” notification you could leave meta = null (or put conversationId if you like).
   */
  @Column('simple-json', { nullable: true })
  meta: any;
}

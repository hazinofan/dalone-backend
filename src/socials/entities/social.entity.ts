// backend/src/socials/social-link.entity.ts
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('social_links')
export class SocialLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.socialLinks, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 20 })
  platform: string;        // e.g. 'facebook', 'twitter', 'website'  

  @Column({ nullable: true })
  username: string;        // for social handles

  @Column({ nullable: true })
  url: string;             // for website or full URLs

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

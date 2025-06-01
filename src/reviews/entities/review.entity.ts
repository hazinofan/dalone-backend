import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  // who wrote it
  @ManyToOne(() => User, user => user.reviewsWritten, { onDelete: 'CASCADE' })
  client: User;

  // whose profile it's about
  @ManyToOne(() => User, user => user.reviewsReceived, { onDelete: 'CASCADE' })
  professional: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

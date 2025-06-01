import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({type: 'text'})
  description: string;
  
  @Column()
  category: string;

  @Column('simple-json')
  imageUrl: string[];

  @Column()
  userId: number;

  @Column({ type: 'date'})
  date: Date;

  @ManyToOne(() => User, (user) => user.works, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

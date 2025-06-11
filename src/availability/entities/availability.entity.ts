// src/availability/availability.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('availabilities')
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: User;

  @Column()
  dayOfWeek: number; // 0=Sunday, 1=Monday...

  @Column()
  startTime: string; // e.g., "09:00"

  @Column()
  endTime: string; // e.g., "12:00"
}
 
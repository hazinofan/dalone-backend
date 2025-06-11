// src/reservation/reservation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'professional_id' })
  professional: User;

  @Column()
  date: string; // e.g., "2025-06-10"

  @Column({ type: 'time' })
  startTime: string;       // e.g. "10:30"

  @Column({ type: 'time' })
  endTime: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  message?: string;

  @CreateDateColumn()
  createdAt: Date;
} 

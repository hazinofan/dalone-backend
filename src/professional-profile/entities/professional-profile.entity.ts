// src/users/entities/professional-profile.entity.ts
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type LanguageLevel = 'Native' | 'Fluent' | 'Beginner';
export interface Language {
  name: string;
  level: LanguageLevel;
}

@Entity('professional_profiles')
export class ProfessionalProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.professionalProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({type: 'text' })
  description: string;

  @Column()
  occupation: string;

  @Column()
  phoneNumber: string;

  @Column()
  country: string

  @Column()
  city: string

  @Column('simple-json', { nullable: true })
  languages?: Language[];

  @Column('simple-array', { nullable: true })
  skills?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { ProfessionalProfile } from 'src/professional-profile/entities/professional-profile.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'pending' })
  role: 'client' | 'professional' | 'admin' | 'pending';

  @Column({ nullable: true })
  currentHashedRefreshToken: string;

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  professionalProfile?: ProfessionalProfile;

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  clientProfile?: ClientProfile;
}

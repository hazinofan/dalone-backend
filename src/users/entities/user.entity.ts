import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { Follow } from 'src/followers/follower.entity';
import { Gig } from 'src/gig/entities/gig.entity';
import { ProfessionalProfile } from 'src/professional-profile/entities/professional-profile.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { SocialLink } from 'src/socials/entities/social.entity';
import { Work } from 'src/work/entities/work.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'pending' })
  role: 'client' | 'professional' | 'admin' | 'pending';

  @Column({ type: 'datetime', nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  currentHashedRefreshToken: string; 

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  professionalProfile?: ProfessionalProfile;

  @OneToOne(() => ClientProfile, (profile) => profile.user)
  clientProfile?: ClientProfile;

  @OneToMany(() => Work, (work) => work.user)
  works: Work[];

  @OneToMany(() => Review, review => review.client)
  reviewsWritten: Review[];

  @OneToMany(() => SocialLink, social => social.user)
  socialLinks: Review[];

  // all the reviews this user has received (as a professional)
  @OneToMany(() => Review, review => review.professional)
  reviewsReceived: Review[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followings: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Gig, (gig) => gig.user)
  gig: Gig[];
}

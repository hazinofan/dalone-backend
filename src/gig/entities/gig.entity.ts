import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

@Entity('gigs')
export class Gig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    heroImage: string;

    @Column()
    title: string; 
    
    @Column('text')
    about: string; 

    @Column('simple-json')
    whatsIncluded: string[];

    @Column()
    servicePeriod: string; 

    @Column('decimal', { precision: 10, scale: 2 })
    priceBeforePromo: number;  

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    priceAfterPromo: number;

    @Column('simple-json')
    availability: {
        [day: string]: { from: string; to: string };
    };

    @Column({ default: false })
    enableCustomOffers: boolean;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    customOfferPriceBeforePromo: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    customOfferPriceAfterPromo: number;

    @Column('text', { nullable: true })
    customOfferDescription: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.works, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

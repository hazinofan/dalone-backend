import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn() id: number;
    
    @Column({ unique: true })
    email: string;
    
    @Column({nullable: true}) 
    password: string;
    
    @Column({ default: 'pending' }) 
    role: 'client' | 'professional' | 'admin' | 'pending';
    
    @Column({ nullable: true })
    currentHashedRefreshToken: string;
}

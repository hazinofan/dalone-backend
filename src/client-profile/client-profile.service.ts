// src/client-profile/client-profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProfile } from './entities/client-profile.entity';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientProfileService {
  constructor(
    @InjectRepository(ClientProfile)
    private repo: Repository<ClientProfile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(userId: number, dto: CreateClientProfileDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const profile = this.repo.create({
      ...dto,
      user: user,
    });

    return this.repo.save(profile);
  }

  async findByUserId(userId: number) {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user'], // Optional, if you want user data
    });
  }

  async update(userId: number, dto: Partial<CreateClientProfileDto>) {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    Object.assign(profile, dto);
    return this.repo.save(profile);
  }
}

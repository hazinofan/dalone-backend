// src/client-profile/client-profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProfile } from './entities/client-profile.entity';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';

@Injectable()
export class ClientProfileService {
  constructor(
    @InjectRepository(ClientProfile)
    private repo: Repository<ClientProfile>,
  ) {}

  async create(userId: number, dto: CreateClientProfileDto) {
    const profile = this.repo.create({
      ...dto,
      user: { id: userId },
    });
    return this.repo.save(profile);
  }

  async findByUserId(userId: number) {
    const profile = await this.repo.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) throw new NotFoundException('Client profile not found');
    return profile;
  }
}

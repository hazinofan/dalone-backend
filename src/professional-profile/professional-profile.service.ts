// src/professional-profile/professional-profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalProfile } from './entities/professional-profile.entity';
import { CreateProfessionalProfileDto } from './dto/create-professional-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';

@Injectable()
export class ProfessionalProfileService {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private readonly repo: Repository<ProfessionalProfile>,
  ) {}

  /** Fetch the profile for a given user ID */
  async findByUserId(userId: number): Promise<ProfessionalProfile> {
    const profile = await this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`No professional profile for user ${userId}`);
    }
    return profile;
  }

  /** Create or update the profile for a given user */
  async upsertProfile(
    userId: number,
    dto: CreateProfessionalProfileDto | UpdateProfessionalProfileDto,
  ): Promise<ProfessionalProfile> {
    let profile = await this.repo.findOne({
      where: { user: { id: userId } },
    });

    if (profile) {
      // merge updates
      profile = this.repo.merge(profile, dto);
    } else {
      // create new, linking only the user ID
      profile = this.repo.create({ ...dto, user: { id: userId } as any });
    }

    return this.repo.save(profile);
  }
}

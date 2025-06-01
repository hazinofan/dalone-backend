import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLink } from './entities/social.entity';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(SocialLink)
    private readonly repo: Repository<SocialLink>,
  ) { }

  //Add 
  async createForUser(userId: number, dto: Partial<SocialLink>) {
    const entity = this.repo.create({ ...dto, user: { id: userId } });
    return this.repo.save(entity);
  }

  // READ
  findAllForUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  // CREATE or UPDATE (bulk replace)
  async upsertForUser(userId: number, links: Partial<SocialLink>[]) {
    // delete old
    await this.repo.delete({ user: { id: userId } });
    // insert new
    const entities = links.map((l) =>
      this.repo.create({ ...l, user: { id: userId } }),
    );
    return this.repo.save(entities);
  }

  // DELETE ONE
  removeOne(userId: number, id: number) {
    return this.repo.delete({ id, user: { id: userId } });
  }

  // DELETE ALL
  removeAll(userId: number) {
    return this.repo.delete({ user: { id: userId } });
  }

  //PATCH 
  async patchForUser(
    userId: number,
    id: number,
    dto: Partial<SocialLink>
  ) {
    const link = await this.repo.findOne({
      where: { id, user: { id: userId } }
    });
    if (!link) throw new NotFoundException('Link not found');
    Object.assign(link, dto);
    return this.repo.save(link);
  }
}


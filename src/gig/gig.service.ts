import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gig } from './entities/gig.entity';

@Injectable()
export class GigService {
  constructor(
    @InjectRepository(Gig)
    private readonly gigRepo: Repository<Gig>,
  ) { }

  create(data: Partial<Gig>) {
    return this.gigRepo.save(data);
  }

  findAll() {
    return this.gigRepo.find();
  }

  findOne(id: number) {
    return this.gigRepo.findOne({
      where: { id },
      relations: {
        user: {
          professionalProfile: true
        }
      },
    });
  }

  async findByUserId(userId: number): Promise<Gig[]> {
    return this.gigRepo.find({ where: { user: { id: userId } } });
  }

  update(id: number, data: Partial<Gig>) {
    return this.gigRepo.update(id, data);
  }

  delete(id: number) {
    return this.gigRepo.delete(id);
  }
}

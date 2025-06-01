import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './entities/work.entity';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private readonly worksRepo: Repository<Work>,
  ) {}

  create(createDto: CreateWorkDto) {
    return this.worksRepo.save(createDto);
  }

  findAll() {
    return this.worksRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.worksRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  findByUser(userId: number) {
    return this.worksRepo.find({
      where: { userId },
      relations: ['user'],
    });
  }

  update(id: number, updateDto: UpdateWorkDto) {
    return this.worksRepo.update(id, updateDto);
  } 

  remove(id: number) {
    return this.worksRepo.delete(id);
  }
}

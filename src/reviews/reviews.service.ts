// src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(input: {
    rating: number;
    comment: string;
    clientId: number;
    professionalId: number;
  }) {
    const client = await this.userRepo.findOneBy({ id: input.clientId });
    const professional = await this.userRepo.findOneBy({ id: input.professionalId });
    if (!client || !professional) {
      throw new NotFoundException('Client or Professional not found');
    }

    const review = this.reviewRepo.create({
      rating: input.rating,
      comment: input.comment,
      client,
      professional,
    });
    return this.reviewRepo.save(review);
  }

  findAll() {
    return this.reviewRepo.find({
      relations: {
        client: true,
        professional: true
      }
    });
  }

  async findOne(id: number) {
    // <-- also change this
    const review = await this.reviewRepo.findOneBy({ id });
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async findByProfessional(professionalId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { professional: { id: professionalId } },
      relations: ['client'],  // include the client who wrote it
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.findOne(id);
    Object.assign(review, dto);
    return this.reviewRepo.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepo.remove(review);
  }
}

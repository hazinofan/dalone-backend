import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAvailabilityDto, UpdateAvailabilityDto } from "./dto/create-availability.dto";
import { User } from "src/users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Availability } from "./entities/availability.entity";

// src/availability/availability.service.ts
@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async create(userId: number, dto: CreateAvailabilityDto) {
    const professional = await this.userRepo.findOneBy({ id: userId });
    if (!professional) throw new NotFoundException('User not found');

    const availability = this.availabilityRepo.create({ ...dto, professional });
    return this.availabilityRepo.save(availability);
  }

  async findAllForUser(userId: number) {
    return this.availabilityRepo.find({
      where: { professional: { id: userId } },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateAvailabilityDto) {
    await this.availabilityRepo.update(id, dto);
    return this.availabilityRepo.findOneBy({ id });
  }

  async delete(id: number) {
    return this.availabilityRepo.delete(id);
  }
}

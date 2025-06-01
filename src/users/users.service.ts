// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  async create(dto: CreateUserDto): Promise<User> {
    const payload: Partial<User> = {
      email: dto.email,
      role: dto.role ?? 'pending',
    };

    if (dto.password) {
      payload.password = await bcrypt.hash(dto.password, 10);
    }

    const user = this.usersRepo.create(payload);
    return this.usersRepo.save(user);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepo.update(userId, { lastLogin: new Date() });
  }


  findAll(): Promise<User[]> {
    return this.usersRepo.find({
      select: ['id', 'email', 'role'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: {
        professionalProfile: true,
        clientProfile: true
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.usersRepo.preload({ id, ...dto });
    if (!toUpdate) throw new NotFoundException(`User ${id} not found`);
    if (dto.password) {
      toUpdate.password = await bcrypt.hash(dto.password, 10);
    }
    return this.usersRepo.save(toUpdate);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }

  async updateRole(
    userId: number,
    role: 'client' | 'professional'
  ): Promise<User> {
    await this.usersRepo.update(userId, { role });
    return this.usersRepo.findOneOrFail({
      where: { id: userId }
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['professionalProfile', 'clientProfile'],  
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}

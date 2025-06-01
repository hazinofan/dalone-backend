import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follower.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follow)
    private readonly repo: Repository<Follow>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) { }
  // Create a follow
  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) throw new BadRequestException("Can't follow yourself");

    const follower = await this.usersRepo.findOneBy({ id: followerId });
    const following = await this.usersRepo.findOneBy({ id: followingId });

    if (!follower || !following || following.role !== 'professional') {
      throw new NotFoundException('Invalid users or role');
    }

    const existing = await this.repo.findOne({ where: { follower: { id: followerId }, following: { id: followingId } } });
    if (existing) throw new ConflictException('Already following');

    const follow = this.repo.create({ follower, following });
    return this.repo.save(follow);
  }

  // Unfollow
  async unfollowUser(followerId: number, followingId: number) {
    const result = await this.repo.delete({ follower: { id: followerId }, following: { id: followingId } });
    if (result.affected === 0) throw new NotFoundException('Follow not found');
  }

  //Followers Count
  async countFollowers(proId: number): Promise<number> {
    const count = await this.repo.count({
      where: {
        following: { id: proId },
      },
    });
    return count;
  }

  //checking on page load 
  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.repo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    return !!follow;
  }
}

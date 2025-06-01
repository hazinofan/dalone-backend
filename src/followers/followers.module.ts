import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { Follow } from './follower.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}

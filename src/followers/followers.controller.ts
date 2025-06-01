import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) { }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  follow(@Param('id') followingId: number, @Req() req) {
    return this.followersService.followUser(req.user.id, followingId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  unfollow(@Param('id') followingId: number, @Req() req) {
    return this.followersService.unfollowUser(req.user.id, followingId);
  }

  @Get('count/:id') // id = professional's user ID
  async getFollowersCount(@Param('id') id: number) {
    return this.followersService.countFollowers(+id);
  }

  @Get('is-following/:proId')
  @UseGuards(JwtAuthGuard)
  async isFollowing(@Param('proId') proId: number, @Req() req) {
    return this.followersService.isFollowing(req.user.id, +proId);
  }
}

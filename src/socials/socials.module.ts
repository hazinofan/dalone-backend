// src/socials/socials.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialsService } from './socials.service';
import { SocialsController } from './socials.controller';
import { SocialLink } from './entities/social.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialLink]),
  ],
  controllers: [SocialsController],
  providers: [SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}

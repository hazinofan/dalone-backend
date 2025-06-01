import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GigService } from './gig.service';
import { GigController } from './gig.controller';
import { Gig } from './entities/gig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gig])],
  providers: [GigService],
  controllers: [GigController],
})
export class GigModule {}

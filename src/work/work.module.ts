import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { User } from 'src/users/entities/user.entity';
import { WorksController } from './work.controller';
import { WorksService } from './work.service';

@Module({
  imports: [TypeOrmModule.forFeature([Work, User])],
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}

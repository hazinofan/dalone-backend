// src/professional-profile/professional-profile.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfileService } from './professional-profile.service';
import { ProfessionalProfileController } from './professional-profile.controller';
import { ProfessionalProfile } from './entities/professional-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile])],
  providers: [ProfessionalProfileService],
  controllers: [ProfessionalProfileController],
  exports: [ProfessionalProfileService],
})
export class ProfessionalProfileModule {}

import { Module } from '@nestjs/common';
import { ClientProfileService } from './client-profile.service';
import { ClientProfileController } from './client-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProfile } from './entities/client-profile.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientProfile, User]) ],
  controllers: [ClientProfileController],
  providers: [ClientProfileService],
})
export class ClientProfileModule {}

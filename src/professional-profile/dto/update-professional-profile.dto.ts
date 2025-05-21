import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalProfileDto } from './create-professional-profile.dto';

export class UpdateProfessionalProfileDto extends PartialType(CreateProfessionalProfileDto) {}

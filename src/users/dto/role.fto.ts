// src/users/dto/role.dto.ts
import { IsIn } from 'class-validator';

export class RoleDto {
  @IsIn(['client', 'professional'])
  accountType: 'client' | 'professional';
}

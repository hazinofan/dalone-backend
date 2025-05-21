// src/users/dto/create-user.dto.ts
import { IsEmail, MinLength, IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()     email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: any;

  @IsOptional()
  @IsIn(['client','professional','admin', 'pending'])
  role?: 'client' | 'professional' | 'admin' | 'pending';
}

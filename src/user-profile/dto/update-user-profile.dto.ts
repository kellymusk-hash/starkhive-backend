import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProfileDto } from './create-user-profile.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsIn,
} from 'class-validator';

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  walletAddress?: string;

  @IsNumber()
  @IsOptional()
  reputationScore?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ETH', 'USDC', 'STARKNET'])
  paymentPreference?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  workHistory?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}


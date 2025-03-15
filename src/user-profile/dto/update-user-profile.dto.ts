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
}


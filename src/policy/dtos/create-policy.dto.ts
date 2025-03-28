import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PolicyType, PolicyStatus } from '../policy.entity';

class InitialVersionDto {
  @IsString()
  content: string;

  @IsOptional()
  effectiveDate?: Date;
}

export class CreatePolicyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(PolicyType)
  type: PolicyType;

  @IsEnum(PolicyStatus)
  @IsOptional()
  status?: PolicyStatus;

  @IsBoolean()
  @IsOptional()
  requiresExplicitConsent?: boolean;

  @IsBoolean()
  @IsOptional()
  autoEnforce?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => InitialVersionDto)
  initialVersion?: InitialVersionDto;
}

import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreatePolicyVersionDto {
  @IsUUID()
  policyId: string;

  @IsString()
  versionNumber: string;

  @IsString()
  content: string;

  @IsOptional()
  changes?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isCurrentVersion?: boolean;

  @IsDate()
  @IsOptional()
  effectiveDate?: Date;
}

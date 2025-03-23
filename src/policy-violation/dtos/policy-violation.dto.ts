import { IsUUID, IsString, IsEnum, IsOptional } from 'class-validator';
import { ViolationSeverity } from '../policy-violation.entity';

export class CreatePolicyViolationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  policyId: string;

  @IsString()
  description: string;

  @IsOptional()
  evidence?: Record<string, any>;

  @IsEnum(ViolationSeverity)
  @IsOptional()
  severity?: ViolationSeverity;
}

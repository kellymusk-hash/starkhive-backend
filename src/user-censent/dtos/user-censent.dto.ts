import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUserConsentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  policyId: string;

  @IsUUID()
  @IsOptional()
  policyVersionId?: string;

  @IsBoolean()
  @IsOptional()
  hasConsented?: boolean = true;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

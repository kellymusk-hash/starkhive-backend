import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsNumber()
  salary?: number;
}

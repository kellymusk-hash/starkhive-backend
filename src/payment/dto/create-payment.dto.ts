import { IsEmail, IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(100, { message: 'Amount must be at least 100' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsUUID('4', { message: 'Contract ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Contract ID is required' })
  contractId: string;

  @IsString({ message: 'Purpose must be a string' })
  @IsOptional()
  purpose?: string;

  @IsString({ message: 'Currency must be a string' })
  @IsOptional()
  currency?: string = 'NGN';

  @IsOptional()
  @IsString()
  transactionHash?: string;
}

import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  walletAddress?: string;

}

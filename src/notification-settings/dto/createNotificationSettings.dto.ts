import { IsBoolean } from 'class-validator';

export class CreateNotificationSettingsDto {
  @IsBoolean()
  email: boolean;

  @IsBoolean()
  sms: boolean;

  @IsBoolean()
  push: boolean;
}

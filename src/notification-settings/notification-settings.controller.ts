import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { UpdateNotificationSettingsDto } from './dto/updateNotificationSettings.dto';


@Controller('notification-settings')
export class NotificationSettingsController {
    /**injecting notification setting controller */
  constructor(private readonly notificationSettingsService: NotificationSettingsService) {}

  @Get(':userId')
  public getNotificationSettings(@Param('userId') userId: number) {
    return this.notificationSettingsService.getSettings(userId);
  }

  @Patch(':userId')
  public updateNotificationSettings(@Param('userId') userId: number, @Body() updateDto: UpdateNotificationSettingsDto) {
    return this.notificationSettingsService.updateSettings(userId, updateDto);
  }
}

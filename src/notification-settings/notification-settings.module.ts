import { Module } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettingsController } from './notification-settings.controller';

@Module({
  providers: [NotificationSettingsService],
  controllers: [NotificationSettingsController],
  exports: [NotificationSettingsService], // Make service available for other modules to import and use.
})
export class NotificationSettingsModule {}

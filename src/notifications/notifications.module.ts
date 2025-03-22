import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationSettingsModule } from '@src/notification-settings/notification-settings.module';

@Module({
  imports: [NotificationSettingsModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService], // Make service available for other modules to import and use.
})
export class NotificationsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationSettingsModule } from '@src/notification-settings/notification-settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobNotification } from './entities/job-notification.entities';
import { PolicyVersionModule } from '@src/policy-version/policy-version.module';

@Module({
  imports: [
    NotificationSettingsModule,
    TypeOrmModule.forFeature([JobNotification]),
    forwardRef(() => PolicyVersionModule),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService], // Make service available for other modules to import and use.
})
export class NotificationsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationSettingsModule } from '@src/notification-settings/notification-settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobNotification } from './entities/job-notification.entities';
import { PolicyVersionModule } from '@src/policy-version/policy-version.module';
import { ConnectionNotification } from './entities/connection-notification.entity';
import { SseModule } from '@src/sse/sse.module';

@Module({
  imports: [
    NotificationSettingsModule,
    TypeOrmModule.forFeature([JobNotification, ConnectionNotification]),
    forwardRef(() => PolicyVersionModule),
    forwardRef(() => SseModule),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
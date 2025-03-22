import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettings } from './entities/notification-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSettings])],
  providers: [NotificationSettingsService],
  exports: [NotificationSettingsService],
})
export class NotificationSettingsModule {}

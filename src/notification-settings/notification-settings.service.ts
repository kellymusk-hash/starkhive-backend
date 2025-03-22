import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSettings } from './entities/notification-settings.entity';
import { UpdateNotificationSettingsDto } from './dto/updateNotificationSettings.dto';

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectRepository(NotificationSettings)
    private readonly notificationSettingsRepository: Repository<NotificationSettings>,
  ) {}

  /**Get User Notification Settings */
  public async getSettings(userId: number): Promise<NotificationSettings> {
    const settings = await this.notificationSettingsRepository.findOne({ where: { userId } });

    if (!settings) {
      throw new NotFoundException(`Notification settings not found for user ID ${userId}`);
    }

    return settings;
  }

  /** Update or Create Notification Settings */
  async updateSettings(userId: number, updateDto: UpdateNotificationSettingsDto): Promise<NotificationSettings> {
    let settings = await this.notificationSettingsRepository.findOne({ where: { userId } });

    if (!settings) {
      settings = this.notificationSettingsRepository.create({ userId, ...updateDto });
    } else {
      Object.assign(settings, updateDto);
    }

    return this.notificationSettingsRepository.save(settings);
  }
}

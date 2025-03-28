import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CacheService } from "@src/cache/cache.service";

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService, private cacheManager: CacheService) {}

    /** Get all notifications for a user */
    @Get(':userId')
    public async getJobNotification(@Param('userId') userId: number) {
        const cachedNotifications = await this.cacheManager.get(`notifications:${userId}`, `NotificationsService`);
        if (cachedNotifications) {
            return cachedNotifications;
        }
        const notifications = await this.notificationService.findByUser(userId);
        await this.cacheManager.set(`notifications:${userId}`, notifications);
        return notifications;
    }

    /** Create a new notification */
    @Post('send')
    public async sendNotification(@Body() createNotificationDto: CreateNotificationDto) {
        await this.cacheManager.del(`notifications:${createNotificationDto.userId}`);
        return await this.notificationService.create(createNotificationDto);
    }

    /** Mark a notification as read */
    @Patch(':id')
    public async markAsRead(@Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
        return await this.notificationService.markAsRead(id, updateNotificationDto.read ?? true);
    }
}

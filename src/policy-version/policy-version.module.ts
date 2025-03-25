import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyVersion } from './policy-version.entity';
import { PolicyVersionService } from './policy-version.service';
import { PolicyVersionController } from './policy-version.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PolicyVersion]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [PolicyVersionController],
  providers: [PolicyVersionService],
  exports: [PolicyVersionService],
})
export class PolicyVersionModule {}

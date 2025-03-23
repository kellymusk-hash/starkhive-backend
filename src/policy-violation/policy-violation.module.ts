import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyViolation } from './policy-violation.entity';
import { PolicyViolationService } from './policy-violation.service';
import { PolicyViolationController } from './policy-violation.controller';
import { Policy } from '../policy/policy.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PolicyViolation, Policy]),
    NotificationsModule,
  ],
  controllers: [PolicyViolationController],
  providers: [PolicyViolationService],
  exports: [PolicyViolationService],
})
export class PolicyViolationModule {}

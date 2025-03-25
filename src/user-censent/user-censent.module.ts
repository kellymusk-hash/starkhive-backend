import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConsent } from './user-censent.entity';
import { UserConsentService } from './user-censent.service';
import { UserConsentController } from './user-censent.controller';
import { PolicyVersionModule } from '../policy-version/policy-version.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserConsent]), PolicyVersionModule],
  controllers: [UserConsentController],
  providers: [UserConsentService],
  exports: [UserConsentService],
})
export class UserConsentModule {}

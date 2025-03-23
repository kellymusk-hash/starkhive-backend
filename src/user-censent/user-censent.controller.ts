import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserConsentService } from './user-censent.service';
import type { CreateUserConsentDto } from './dtos/user-censent.dto';

@Controller('user-consents')
export class UserConsentController {
  constructor(private readonly userConsentService: UserConsentService) {}

  @Post()
  recordConsent(@Body() createUserConsentDto: CreateUserConsentDto) {
    return this.userConsentService.recordConsent(createUserConsentDto);
  }

  @Delete('user/:userId/policy/:policyId')
  withdrawConsent(
    @Param('userId') userId: string,
    @Param('policyId') policyId: string,
  ) {
    return this.userConsentService.withdrawConsent(userId, policyId);
  }

  @Get('user/:userId/policy/:policyId/check')
  checkUserConsent(
    @Param('userId') userId: string,
    @Param('policyId') policyId: string,
  ) {
    return this.userConsentService.checkUserConsent(userId, policyId);
  }

  @Get('user/:userId')
  getUserConsents(@Param('userId') userId: string) {
    return this.userConsentService.getUserConsents(userId);
  }

  @Get('policy/:policyId')
  getPolicyConsents(@Param('policyId') policyId: string) {
    return this.userConsentService.getPolicyConsents(policyId);
  }
}

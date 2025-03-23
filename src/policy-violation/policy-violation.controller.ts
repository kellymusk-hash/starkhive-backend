import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PolicyViolationService } from './policy-violation.service';
import { CreatePolicyViolationDto } from './dtos/policy-violation.dto';
import { ViolationStatus } from './policy-violation.entity';

@Controller('policy-violations')
export class PolicyViolationController {
  constructor(
    private readonly policyViolationService: PolicyViolationService,
  ) {}

  @Post('detect')
  detectViolation(@Body() createPolicyViolationDto: CreatePolicyViolationDto) {
    return this.policyViolationService.detectViolation(
      createPolicyViolationDto,
    );
  }

  @Post(':id/enforce')
  enforcePolicy(@Param('id') id: string) {
    return this.policyViolationService.enforcePolicy(id);
  }

  @Post(':id/review')
  reviewViolation(
    @Param('id') id: string,
    @Body('reviewerId') reviewerId: string,
    @Body('status') status: ViolationStatus,
    @Body('comments') comments?: string,
  ) {
    return this.policyViolationService.reviewViolation(
      id,
      reviewerId,
      status,
      comments,
    );
  }

  @Get()
  findAll() {
    return this.policyViolationService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.policyViolationService.findByUser(userId);
  }

  @Get('policy/:policyId')
  findByPolicy(@Param('policyId') policyId: string) {
    return this.policyViolationService.findByPolicy(policyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policyViolationService.findOne(id);
  }
}

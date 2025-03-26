import { Controller, Get, Param, Query } from '@nestjs/common';
import { PolicyReportingService } from './policy-reporting.service';
import { ViolationSeverity } from '../policy-violation/policy-violation.entity';

@Controller('policy-reporting')
export class PolicyReportingController {
  constructor(
    private readonly policyReportingService: PolicyReportingService,
  ) {}

  @Get('violations/policy/:policyId')
  getViolationsByPolicy(
    @Param('policyId') policyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.policyReportingService.getViolationsByPolicy(
      policyId,
      start,
      end,
    );
  }

  @Get('violations/user/:userId')
  getViolationsByUser(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.policyReportingService.getViolationsByUser(userId, start, end);
  }

  @Get('violations/severity/:severity')
  getViolationsBySeverity(
    @Param('severity') severity: ViolationSeverity,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.policyReportingService.getViolationsBySeverity(
      severity,
      start,
      end,
    );
  }

  @Get('consent-rate/policy/:policyId')
  getConsentRateByPolicy(@Param('policyId') policyId: string) {
    return this.policyReportingService.getConsentRateByPolicy(policyId);
  }

  @Get('compliance-report')
  generateComplianceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.policyReportingService.generateComplianceReport(start, end);
  }
}

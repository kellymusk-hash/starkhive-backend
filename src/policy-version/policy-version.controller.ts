import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PolicyVersionService } from './policy-version.service';
import { CreatePolicyVersionDto } from './dtos/create-policy-version.dto';

@Controller('policy-versions')
export class PolicyVersionController {
  constructor(private readonly policyVersionService: PolicyVersionService) {}

  @Post()
  create(@Body() createPolicyVersionDto: CreatePolicyVersionDto) {
    return this.policyVersionService.create(createPolicyVersionDto);
  }

  @Get('policy/:policyId')
  findAll(@Param('policyId') policyId: string) {
    return this.policyVersionService.findAll(policyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policyVersionService.findOne(id);
  }

  @Get('policy/:policyId/current')
  getCurrentVersion(@Param('policyId') policyId: string) {
    return this.policyVersionService.getCurrentVersion(policyId);
  }

  @Get('compare/:versionId1/:versionId2')
  compareVersions(
    @Param('versionId1') versionId1: string,
    @Param('versionId2') versionId2: string,
  ) {
    return this.policyVersionService.compareVersions(versionId1, versionId2);
  }
}

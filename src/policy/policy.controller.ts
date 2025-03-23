import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import type { PolicyService } from './policy.service';
import type { CreatePolicyDto } from './dtos/create-policy.dto';
import type { UpdatePolicyDto } from './dtos/update-policy.dto';

@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policyService.create(createPolicyDto);
  }

  @Get()
  findAll() {
    return this.policyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.policyService.remove(id);
  }

  @Post(':id/activate')
  activatePolicy(@Param('id') id: string) {
    return this.policyService.activatePolicy(id);
  }

  @Post(':id/archive')
  archivePolicy(@Param('id') id: string) {
    return this.policyService.archivePolicy(id);
  }
}

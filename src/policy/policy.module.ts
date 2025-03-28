import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './policy.entity';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { PolicyVersionModule } from '../policy-version/policy-version.module';

@Module({
  imports: [TypeOrmModule.forFeature([Policy]), PolicyVersionModule],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}

import { Module } from '@nestjs/common';
import { CompanyService } from './provider/company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { FindACompanyProvider } from './provider/find-a-company.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyService, FindACompanyProvider],
  controllers: [CompanyController],
  exports: [CompanyService, FindACompanyProvider],
})
export class CompanyModule {}

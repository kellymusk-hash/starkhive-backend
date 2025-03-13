import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './provider/company.service';

// Controller for handling company-related HTTP requests.

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  public async getCompany(@Param('id') id: number) {
    return {};
  }

  public async POSTCompany() {
    return {};
  }  
}

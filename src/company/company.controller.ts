import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CompanyService } from './provider/company.service';
import { CreateCompanyDto } from './DTO/create-company.dto';


@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companyService.findById(id);
  }
}

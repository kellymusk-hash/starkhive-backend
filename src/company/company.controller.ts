import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CompanyService } from './provider/company.service';
import { CreateCompanyDto } from './DTO/create-company.dto';


//   Controller for handling company-related HTTP requests.
//   Defines endpoints for creating, retrieving, and finding companies.
 
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  
    // Creates a new company.
    // @param createCompanyDto - The DTO containing company details.
    // @returns The newly created company.
   
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  
    // Retrieves all companies.
    // @returns An array of all company records.
   
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  /**
   * Finds a company by its ID.
   * @param id - The ID of the company to find.
   * @returns The company entity if found, otherwise null.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companyService.findById(id);
  }
}

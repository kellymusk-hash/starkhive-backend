import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company.entity';
import { CreateCompanyDto } from '../DTO/create-company.dto';


//   Service responsible for handling company-related business logic.
 
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>, // Injecting the Company repository
  ) {}

  
    // Creates a new company and saves it in the database.
    // @param createCompanyDto - Data Transfer Object containing company details
    // @returns The created company entity
   
  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto); // Create a new company instance
    return this.companyRepository.save(company); // Save the company in the database
  }

  
    // Retrieves all companies from the database.
    // @returns An array of all companies
   
  async findAll(): Promise<Company[]> {
    return this.companyRepository.find(); // Fetch all company records
  }

  
    // Finds a company by its ID.
    // @param id - The ID of the company to find
    // @returns The company entity if found, otherwise null
   
  async findById(id: number): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { id } }); // Find a company by its ID
  }
}

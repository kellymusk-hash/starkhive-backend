import { Injectable, ConflictException } from '@nestjs/common';
import { CreateCompanyDto } from '../DTO/create-company.dto';
import { UpdateCompanyDto } from '../DTO/updateCompanyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company.entity';

@Injectable()
export class CompanyService {
  constructor(
      @InjectRepository(Company)
      private companyRepository: Repository<Company>,
    ) {}

  // Create a company
  async create(createCompanyDto: CreateCompanyDto) {

    const existingCompany = await this.companyRepository.findOne({
      where: { name: createCompanyDto.name }
    })

    if (existingCompany) {
      throw new ConflictException(`A company with the name "${createCompanyDto.name}" already exists.`);
    }
  
    let newCompany = this.companyRepository.create(createCompanyDto);
    newCompany = await this.companyRepository.save(newCompany);
    return newCompany;
  }

  // Get all companies
  async findAll() {
    return 'Returning list of companies!';
  }

  // Get one company by ID
  async findOne(id: number) {
    return `Returning company with ID ${id}!`;
  }

  // Update a company
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `Updating company with ID ${id}!`;
  }

  // Delete a company
  async remove(id: number) {
    return `Removing company with ID ${id}!`;
  }
}
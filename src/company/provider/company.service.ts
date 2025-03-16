import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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
    return await this.companyRepository.find({ withDeleted: false });
  }

  // Get one company by ID
  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      withDeleted: false,   //this excludes any company that has been deleted (returns from active companies only)
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found.`);
    }

    return company;  
  }

  // Update a company
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found.`);
    }

    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  // Delete a company
  async remove(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found.`);
    }

    await this.companyRepository.softDelete(id);
    return { message: `Company with ID ${id} has been soft-deleted.` };
  }
}
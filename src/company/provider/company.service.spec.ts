import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../company.entity';
import { CreateCompanyDto } from '../DTO/create-company.dto';

// Mock repository
const mockCompanyRepository = {
  create: jest.fn().mockImplementation((dto) => dto), // Simulate creating an entity
  save: jest.fn().mockImplementation((company) =>
    Promise.resolve({ id: 1, ...company }),
  ), // Simulate saving
  find: jest.fn().mockResolvedValue([
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
  ]), // Simulate finding all companies
  findOne: jest.fn().mockImplementation(({ where: { id } }) =>
    Promise.resolve(id === 1 ? { id: 1, name: 'Company A' } : null),
  ), // Simulate finding by ID
};

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: Repository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company), // Mock TypeORM Repository
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new company', async () => {
    const createCompanyDto: CreateCompanyDto = { name: 'New Company' };
    const result = await service.create(createCompanyDto);
    expect(result).toEqual({ id: 1, name: 'New Company' });
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(createCompanyDto);
    expect(mockCompanyRepository.save).toHaveBeenCalledWith(createCompanyDto);
  });

  it('should return all companies', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      { id: 1, name: 'Company A' },
      { id: 2, name: 'Company B' },
    ]);
    expect(mockCompanyRepository.find).toHaveBeenCalled();
  });

  it('should return a company by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, name: 'Company A' });
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return null if company not found', async () => {
    const result = await service.findById(99);
    expect(result).toBeNull();
    expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
  });
});

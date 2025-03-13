import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './provider/company.service';
import { CreateCompanyDto } from './DTO/create-company.dto';

// Mock service
const mockCompanyService = {
  create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })), // Mock create method
  findAll: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Company A' },
      { id: 2, name: 'Company B' },
    ]),
  ), // Mock findAll method
  findById: jest.fn((id) =>
    Promise.resolve(id === 1 ? { id: 1, name: 'Company A' } : null),
  ), // Mock findById method
};

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: mockCompanyService }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new company', async () => {
    const createCompanyDto: CreateCompanyDto = { name: 'New Company' };
    const result = await controller.create(createCompanyDto);
    
    expect(result).toEqual({ id: 1, name: 'New Company' });
    expect(service.create).toHaveBeenCalledWith(createCompanyDto);
  });

  it('should return all companies', async () => {
    const result = await controller.findAll();
    
    expect(result).toEqual([
      { id: 1, name: 'Company A' },
      { id: 2, name: 'Company B' },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a company by ID', async () => {
    const result = await controller.findOne(1);
    
    expect(result).toEqual({ id: 1, name: 'Company A' });
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should return null if company not found', async () => {
    const result = await controller.findOne(99);
    
    expect(result).toBeNull();
    expect(service.findById).toHaveBeenCalledWith(99);
  });
});

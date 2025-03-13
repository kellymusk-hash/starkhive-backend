import { Test, TestingModule } from '@nestjs/testing';
import { JobPostingsController } from './job-postings.controller';

describe('JobPostingsController', () => {
  let controller: JobPostingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostingsController],
    }).compile();

    controller = module.get<JobPostingsController>(JobPostingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

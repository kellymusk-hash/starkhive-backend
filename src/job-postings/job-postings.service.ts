import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { JobPosting } from './entities/job-posting.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobPostingsService {
  constructor(
    @InjectRepository(JobPosting)
    private readonly jobRepository: Repository<JobPosting>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const [jobs, total] = await this.jobRepository.findAndCount({
      where: search
        ? [{ title: Like(`%${search}%`) }, { company: Like(`%${search}%`) }]
        : {},
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, page, limit, jobs };
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  async create(createJobDto: CreateJobDto) {
    const newJob = this.jobRepository.create(createJobDto);
    return await this.jobRepository.save(newJob);
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const result = await this.jobRepository.update(id, updateJobDto);
    if (result.affected === 0) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Job deleted successfully' };
  }
}

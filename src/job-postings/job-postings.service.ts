import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { JobPosting } from './entities/job-posting.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobPostingsService {
  constructor(
    @InjectRepository(JobPosting)
    private readonly jobRepository: Repository<JobPosting>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    title?: string,
    company?: string,
    location?: string,
    sortBy: string = 'date',
    sortOrder: 'ASC' | 'DESC' = 'DESC', // Default: newest first
  ) {
    const where: any = {};

    if (title) {
      where.title = ILike(`%${title}%`);
    }
    if (location) {
      where.location = ILike(`%${location}%`);
    }
    if (company) {
      where.company = ILike(`%${company}%`);
    }

    // Define allowed sorting fields
    const validSortFields: Record<string, string> = {
      relevance: 'search_vector',
      date: 'createdAt', // Ensure jobs have a createdAt field
      salary: 'salary',
    };

    const orderByField = validSortFields[sortBy] || 'createdAt'; // Default to date
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const [jobs, total] = await this.jobRepository.findAndCount({
      select: ['id', 'title', 'company', 'salary', 'location', 'createdAt'], // Fetch Only required columns
      where,
      order: { [orderByField]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, page, limit, sortBy, sortOrder, jobs };
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

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('job-postings')
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string
  ) {
    return this.jobPostingsService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.jobPostingsService.findOne(Number(id));
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobPostingsService.create(createJobDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobPostingsService.update(Number(id), updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.jobPostingsService.remove(Number(id));
  }
}

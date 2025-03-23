import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { ExportUtils } from './utils/export.utils';

@Injectable()
export class TimeTrackingService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createTimeEntry(freelancer: User, createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    const project = await this.projectRepository.findOne({ where: { id: createTimeEntryDto.projectId }});
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const timeEntry = this.timeEntryRepository.create({
      freelancer,
      project,
      ...createTimeEntryDto,
    });

    if (createTimeEntryDto.endTime) {
      const duration = (createTimeEntryDto.endTime.getTime() - createTimeEntryDto.startTime.getTime()) / (1000 * 60 * 60);
      timeEntry.duration = Number(duration.toFixed(2));
    }

    return this.timeEntryRepository.save(timeEntry);
  }

  async getFreelancerTimeEntries(freelancerId: string): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({
      where: { freelancer: { id: freelancerId } },
      relations: ['project'],
      order: { startTime: 'DESC' },
    });
  }

  async getProjectTimeEntries(projectId: string): Promise<TimeEntry[]> {
    return this.timeEntryRepository.find({
      where: { project: { id: projectId } },
      relations: ['freelancer'],
      order: { startTime: 'DESC' },
    });
  }

  async approveTimeEntry(timeEntryId: string, approverId: string): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({ where: { id: timeEntryId }});
    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    if (timeEntry.isApproved) {
      throw new BadRequestException('Time entry already approved');
    }

    timeEntry.isApproved = true;
    timeEntry.approvedBy = approverId;
    timeEntry.approvedAt = new Date();

    return this.timeEntryRepository.save(timeEntry);
  }

  async generateReport(freelancerId: string, startDate: Date, endDate: Date) {
    const timeEntries = await this.timeEntryRepository
      .createQueryBuilder('timeEntry')
      .leftJoinAndSelect('timeEntry.project', 'project')
      .where('timeEntry.freelancer.id = :freelancerId', { freelancerId })
      .andWhere('timeEntry.startTime >= :startDate', { startDate })
      .andWhere('timeEntry.startTime <= :endDate', { endDate })
      .getMany();

    const totalHours = timeEntries.reduce((sum: number, entry: TimeEntry) => sum + entry.duration, 0);
    const projectSummary = timeEntries.reduce((acc: Record<string, any>, entry: TimeEntry) => {
      const projectId = entry.project.id;
      if (!acc[projectId]) {
        acc[projectId] = {
          projectName: entry.project.name,
          totalHours: 0,
          entries: [],
        };
      }
      acc[projectId].totalHours += entry.duration;
      acc[projectId].entries.push(entry);
      return acc;
    }, {});

    return {
      totalHours,
      projectSummary,
      timeEntries,
    };
  }

  async exportToCSV(freelancerId: string, startDate: Date, endDate: Date): Promise<string> {
    const timeEntries = await this.timeEntryRepository
      .createQueryBuilder('timeEntry')
      .leftJoinAndSelect('timeEntry.project', 'project')
      .leftJoinAndSelect('timeEntry.freelancer', 'freelancer')
      .where('timeEntry.freelancer.id = :freelancerId', { freelancerId })
      .andWhere('timeEntry.startTime >= :startDate', { startDate })
      .andWhere('timeEntry.startTime <= :endDate', { endDate })
      .getMany();

    return ExportUtils.generateCSV(timeEntries);
  }

  async exportToPDF(freelancerId: string, startDate: Date, endDate: Date): Promise<Buffer> {
    const timeEntries = await this.timeEntryRepository
      .createQueryBuilder('timeEntry')
      .leftJoinAndSelect('timeEntry.project', 'project')
      .leftJoinAndSelect('timeEntry.freelancer', 'freelancer')
      .where('timeEntry.freelancer.id = :freelancerId', { freelancerId })
      .andWhere('timeEntry.startTime >= :startDate', { startDate })
      .andWhere('timeEntry.startTime <= :endDate', { endDate })
      .getMany();

    return ExportUtils.generatePDF(timeEntries);
  }
}

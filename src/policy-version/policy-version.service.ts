import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { PolicyVersion } from './policy-version.entity';
import type { CreatePolicyVersionDto } from './dtos/create-policy-version.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PolicyVersionService {
  constructor(
    @InjectRepository(PolicyVersion)
    private policyVersionRepository: Repository<PolicyVersion>,

    @Inject(forwardRef(() => NotificationsService))
    private notificationService: NotificationsService,
  ) {}

  async create(
    createPolicyVersionDto: CreatePolicyVersionDto,
  ): Promise<PolicyVersion> {
    const { policyId, isCurrentVersion } = createPolicyVersionDto;

    // If this is set as the current version, update all other versions
    if (isCurrentVersion) {
      await this.policyVersionRepository.update(
        { policyId, isCurrentVersion: true },
        { isCurrentVersion: false },
      );
    }

    const policyVersion = this.policyVersionRepository.create(
      createPolicyVersionDto,
    );
    const savedVersion = await this.policyVersionRepository.save(policyVersion);

    return savedVersion;
  }

  async findAll(policyId: string): Promise<PolicyVersion[]> {
    return this.policyVersionRepository.find({
      where: { policyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PolicyVersion> {
    const policyVersion = await this.policyVersionRepository.findOne({
      where: { id },
    });

    if (!policyVersion) {
      throw new NotFoundException(`Policy version with ID ${id} not found`);
    }

    return policyVersion;
  }

  async getCurrentVersion(policyId: string): Promise<PolicyVersion> {
    const policyVersion = await this.policyVersionRepository.findOne({
      where: { policyId, isCurrentVersion: true },
    });

    if (!policyVersion) {
      throw new NotFoundException(
        `No current version found for policy ${policyId}`,
      );
    }

    return policyVersion;
  }

  async compareVersions(
    versionId1: string,
    versionId2: string,
  ): Promise<Record<string, any>> {
    const version1 = await this.findOne(versionId1);
    const version2 = await this.findOne(versionId2);

    // This is a simplified comparison - in a real app, you might use a diff library
    return {
      version1: {
        id: version1.id,
        versionNumber: version1.versionNumber,
        effectiveDate: version1.effectiveDate,
      },
      version2: {
        id: version2.id,
        versionNumber: version2.versionNumber,
        effectiveDate: version2.effectiveDate,
      },
      // In a real implementation, you would compute actual differences here
      differences: {
        added: [],
        removed: [],
        modified: [],
      },
    };
  }
}

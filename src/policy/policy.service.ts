import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Policy, PolicyStatus } from './policy.entity';
import type { CreatePolicyDto } from './dtos/create-policy.dto';
import type { UpdatePolicyDto } from './dtos/update-policy.dto';
import type { PolicyVersionService } from '../policy-version/policy-version.service';

@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    private policyVersionService: PolicyVersionService,
  ) {}

  async create(createPolicyDto: CreatePolicyDto): Promise<Policy> {
    const { initialVersion, ...policyData } = createPolicyDto;

    // Create the policy
    const policy = this.policyRepository.create(policyData);
    const savedPolicy = await this.policyRepository.save(policy);

    // Create initial version if provided
    if (initialVersion) {
      await this.policyVersionService.create({
        policyId: savedPolicy.id,
        versionNumber: '1.0',
        content: initialVersion.content,
        isCurrentVersion: true,
        effectiveDate: initialVersion.effectiveDate || new Date(),
      });
    }

    return this.findOne(savedPolicy.id);
  }

  async findAll(): Promise<Policy[]> {
    return this.policyRepository.find({
      relations: ['versions'],
    });
  }

  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyRepository.findOne({
      where: { id },
      relations: ['versions'],
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return policy;
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<Policy> {
    const policy = await this.findOne(id);

    // Update policy fields
    Object.assign(policy, updatePolicyDto);

    return this.policyRepository.save(policy);
  }

  async remove(id: string): Promise<void> {
    const result = await this.policyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
  }

  async activatePolicy(id: string): Promise<Policy> {
    const policy = await this.findOne(id);

    // Check if there's at least one version
    if (!policy.versions || policy.versions.length === 0) {
      throw new Error('Cannot activate a policy without any versions');
    }

    // Check if there's a current version
    const hasCurrentVersion = policy.versions.some(
      (version) => version.isCurrentVersion,
    );

    if (!hasCurrentVersion) {
      throw new Error('Cannot activate a policy without a current version');
    }

    policy.status = PolicyStatus.ACTIVE;
    return this.policyRepository.save(policy);
  }

  async archivePolicy(id: string): Promise<Policy> {
    const policy = await this.findOne(id);
    policy.status = PolicyStatus.ARCHIVED;
    return this.policyRepository.save(policy);
  }
}

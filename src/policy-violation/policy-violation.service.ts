import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import {
  PolicyViolation,
  ViolationStatus,
  ViolationSeverity,
} from './policy-violation.entity';
import type { CreatePolicyViolationDto } from './dtos/policy-violation.dto';
import { Policy } from '../policy/policy.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PolicyViolationService {
  constructor(
    @InjectRepository(PolicyViolation)
    private policyViolationRepository: Repository<PolicyViolation>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,

    @Inject(forwardRef(() => NotificationsService))
    private notificationService: NotificationsService,
  ) {}

  async detectViolation(
    createPolicyViolationDto: CreatePolicyViolationDto,
  ): Promise<PolicyViolation> {
    const {
      userId,
      policyId,
      description,
      evidence,
      severity = ViolationSeverity.MEDIUM,
    } = createPolicyViolationDto;

    // Create a violation record
    const violation = this.policyViolationRepository.create({
      userId,
      policyId,
      description,
      evidence,
      severity,
      status: ViolationStatus.DETECTED,
    });

    const savedViolation = await this.policyViolationRepository.save(violation);

    // Check if this policy has auto-enforcement enabled
    const policy = await this.policyRepository.findOne({
      where: { id: policyId },
    });

    if (policy && policy.autoEnforce) {
      await this.enforcePolicy(savedViolation.id);
    }

    return savedViolation;
  }

  async enforcePolicy(violationId: string): Promise<PolicyViolation> {
    const violation = await this.policyViolationRepository.findOne({
      where: { id: violationId },
      relations: ['policy'],
    });

    if (!violation) {
      throw new Error(`Violation with ID ${violationId} not found`);
    }

    // Implement enforcement logic based on policy type and violation severity
    // This is a simplified example - real enforcement would be more complex
    const enforcementActions = {
      timestamp: new Date(),
      actions: [],
    };

    // Update the violation record
    violation.autoEnforced = true;
    violation.enforcementActions = enforcementActions;
    violation.status = ViolationStatus.CONFIRMED;

    return this.policyViolationRepository.save(violation);
  }

  async reviewViolation(
    violationId: string,
    reviewerId: string,
    status: ViolationStatus,
    comments?: string,
  ): Promise<PolicyViolation> {
    const violation = await this.policyViolationRepository.findOne({
      where: { id: violationId },
    });

    if (!violation) {
      throw new Error(`Violation with ID ${violationId} not found`);
    }

    violation.status = status;
    violation.reviewedBy = reviewerId;
    violation.reviewedAt = new Date();

    if (comments) {
      violation.enforcementActions = {
        ...(violation.enforcementActions || {}),
        reviewComments: comments,
      };
    }

    return this.policyViolationRepository.save(violation);
  }

  async findAll(): Promise<PolicyViolation[]> {
    return this.policyViolationRepository.find({
      relations: ['policy', 'user'],
      order: { detectedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<any> {
    return this.policyViolationRepository.findOneBy({ id });
  }

  async findByUser(userId: string): Promise<PolicyViolation[]> {
    return this.policyViolationRepository.find({
      where: { userId },
      relations: ['policy'],
      order: { detectedAt: 'DESC' },
    });
  }

  async findByPolicy(policyId: string): Promise<PolicyViolation[]> {
    return this.policyViolationRepository.find({
      where: { policyId },
      relations: ['user'],
      order: { detectedAt: 'DESC' },
    });
  }
}

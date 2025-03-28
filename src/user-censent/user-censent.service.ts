import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserConsent } from './user-censent.entity';
import type { CreateUserConsentDto } from './dtos/user-censent.dto';
import type { PolicyVersionService } from '../policy-version/policy-version.service';

@Injectable()
export class UserConsentService {
  constructor(
    @InjectRepository(UserConsent)
    private userConsentRepository: Repository<UserConsent>,
    private policyVersionService: PolicyVersionService,
  ) {}

  async recordConsent(
    createUserConsentDto: CreateUserConsentDto,
  ): Promise<UserConsent> {
    const { userId, policyId, policyVersionId, ipAddress, metadata } =
      createUserConsentDto;

    // If no specific version is provided, use the current version
    let versionId = policyVersionId;
    if (!versionId) {
      const currentVersion =
        await this.policyVersionService.getCurrentVersion(policyId);
      versionId = currentVersion.id;
    }

    // Check if user already has a consent record for this policy
    const existingConsent = await this.userConsentRepository.findOne({
      where: { userId, policyId },
    });

    if (existingConsent) {
      // Update existing consent
      existingConsent.policyVersionId = versionId;
      existingConsent.hasConsented = true;
      return this.userConsentRepository.save(existingConsent);
    }

    // Create new consent record
    const userConsent = this.userConsentRepository.create({
      userId,
      policyId,
      policyVersionId: versionId,
      hasConsented: true,
      ipAddress,
      metadata,
    });

    return this.userConsentRepository.save(userConsent);
  }

  async withdrawConsent(
    userId: string,
    policyId: string,
  ): Promise<UserConsent> {
    const consent = await this.userConsentRepository.findOne({
      where: { userId, policyId },
    });

    if (!consent) {
      throw new NotFoundException(
        `No consent record found for user ${userId} and policy ${policyId}`,
      );
    }

    consent.hasConsented = false;
    return this.userConsentRepository.save(consent);
  }

  async checkUserConsent(userId: string, policyId: string): Promise<boolean> {
    const currentVersion =
      await this.policyVersionService.getCurrentVersion(policyId);

    const consent = await this.userConsentRepository.findOne({
      where: {
        userId,
        policyId,
        policyVersionId: currentVersion.id,
        hasConsented: true,
      },
    });

    return !!consent;
  }

  async getUserConsents(userId: string): Promise<UserConsent[]> {
    return this.userConsentRepository.find({
      where: { userId },
      relations: ['policy', 'policyVersion'],
    });
  }

  async getPolicyConsents(policyId: string): Promise<UserConsent[]> {
    return this.userConsentRepository.find({
      where: { policyId },
    });
  }
}

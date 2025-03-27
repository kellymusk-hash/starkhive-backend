import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';
import { FreelancerPortfolioRepository } from './repositories/freelancer-portfolio.repository';
import { FreelancerPortfolioService } from './freelancer-portfolio.service';
import { CacheService } from "@src/cache/cache.service";

@Controller('freelancer-profile')
export class FreelancerProfileController {
  constructor(
    private readonly freelancerProfileService: FreelancerProfileService,
    private readonly freelancerPortfolioService: FreelancerPortfolioService,
    private cacheManager: CacheService
  ) {}

  @Post()
  create(@Body() createFreelancerProfileDto: CreateFreelancerProfileDto) {
    return this.freelancerProfileService.createProfile(
      createFreelancerProfileDto,
    );
  }

  @Get()
  async findAll() {
    const cachedFreelancerProfiles = await this.cacheManager.get(`freelancer-profile:all`, 'FreelancerProfileService');
    if (cachedFreelancerProfiles) {
      return cachedFreelancerProfiles;
    }
    const freelancerProfiles = await this.freelancerProfileService.findAll(); // Now it should work without errors
    await this.cacheManager.set(`freelancer-profile:all`, freelancerProfiles);
    return freelancerProfiles;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cachedFreelancerProfile = await this.cacheManager.get(`freelancer-profile:${id}`, 'FreelancerProfileService');
    if (cachedFreelancerProfile) {
      return cachedFreelancerProfile;
    }
    const freelancerProfile = await this.freelancerProfileService.getProfileByUserId(id); // Fetch profile by user ID
    await this.cacheManager.set(`freelancer-profile:${id}`, freelancerProfile);
    return freelancerProfile;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFreelancerProfileDto: UpdateFreelancerProfileDto,
  ) {
    await this.cacheManager.del(`freelancer-profile:${id}`);
    const { experience, skills } = updateFreelancerProfileDto;
    if (experience) {
      return this.freelancerProfileService.updateExperience(id, experience);
    }
    if (skills) {
      return this.freelancerProfileService.updateSkills(id, skills);
    }
    // You can expand with other updates like portfolioLinks
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cacheManager.del(`freelancer-profile:${id}`);
    return this.freelancerProfileService.deleteProfile(id);
  }

  @Get('portfolio')
  async getPortfolioProject(
    @Query('sort') sort: 'recent' | 'popular',
    @Query('category') category?: string,
    @Query('tags') tags?: string[],
  ) {
    const filter = {
      category,
      tags,
      sortBy: sort || undefined
    }
    return this.freelancerPortfolioService.findProjects(filter)
  }

  @Post(':/id/view')
  async trackProjectViews(
    @Param('id') projectId: string
  ) {
    return this.freelancerPortfolioService.incrementViews(projectId);
  }
}

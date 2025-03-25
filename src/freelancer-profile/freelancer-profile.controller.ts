import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FreelancerProfileService } from './freelancer-profile.service';
import { CreateFreelancerProfileDto } from './dto/create-freelancer-profile.dto';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';

@Controller('freelancer-profile')
export class FreelancerProfileController {
  constructor(
    private readonly freelancerProfileService: FreelancerProfileService,
  ) {}

  @Post()
  create(@Body() createFreelancerProfileDto: CreateFreelancerProfileDto) {
    return this.freelancerProfileService.createProfile(
      createFreelancerProfileDto,
    );
  }

  @Get()
  findAll() {
    return this.freelancerProfileService.findAll(); // Now it should work without errors
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancerProfileService.getProfileByUserId(id); // Fetch profile by user ID
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreelancerProfileDto: UpdateFreelancerProfileDto,
  ) {
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
  remove(@Param('id') id: string) {
    return this.freelancerProfileService.deleteProfile(id);
  }
}

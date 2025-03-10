/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, Permission } from 'src/auth/roles.enum';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('projects')
export class ProjectsController {
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY)
  @Permissions(Permission.CREATE_PROJECT)
  createProject() {
    return 'Project created!';
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY, Role.FREELANCER)
  @Permissions(Permission.VIEW_PROJECT)
  getProjects() {
    return 'Fetching projects...';
  }

  @Delete()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Permissions(Permission.DELETE_PROJECT)
  deleteProject() {
    return 'Project deleted!';
  }
}

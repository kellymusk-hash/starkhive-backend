import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express'; // Import the extended Request type
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from '@src/audit/audit.service';
import { User } from './user.interface'; // Import the User interface
import { CacheService } from "@src/cache/cache.service";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly auditService: AuditService,
    private cacheManager: CacheService
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const user = await this.userService.create(createUserDto);

    const currentUser = req.user as User; // Cast req.user to User

    if (!currentUser || !currentUser.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    await this.auditService.createLog({
      action: 'user_created',
      resourceType: 'user',
      userId: currentUser.id,
      ipAddress: req.ip,
    });

    return user;
  }

  @Get()
  async findAll() {
    const cachedUsers = await this.cacheManager.get(`user:all`, 'UserService');
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await this.userService.findAll();
    await this.cacheManager.set(`user:all`, users);
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cachedUser = await this.cacheManager.get(`user:${id}`, 'UserService');
    if (cachedUser) {
      return cachedUser;
    }
    const user =  await this.userService.findOne(id);
    await this.cacheManager.set(`user:${id}`, user);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.cacheManager.del(`user:${id}`);
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cacheManager.del(`user:${id}`);
    return this.userService.remove(id);
  }
}
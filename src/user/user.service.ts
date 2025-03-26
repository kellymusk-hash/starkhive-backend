/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheService } from "@src/cache.service";

@Injectable()
export class UserService {
  constructor(private cacheManager: CacheService) {}
  getUserConnections(_userId: string) {
    throw new Error('Method not implemented.');
  }
  create(_createUserDto: CreateUserDto) {
    return 'This method creates the service';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const value = await this.cacheManager.get(`${id}`);
    if (value) {
      console.log(`Cached value: ${value}`);
      return value;
    }
    await this.cacheManager.set(`${id}`, `This action returns a #${id} user`);
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CacheService } from "@src/cache.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
     private cacheManager: CacheService
  ) {}
  
   getUserConnections(_userId: string) {
    throw new Error('Method not implemented.');
     
     async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
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

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getUserConnections(userId: string) {
    // Implementation for getting user connections
    return [];
  }
}

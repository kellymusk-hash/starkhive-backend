import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // you might also want to include UserRepository here if it's custom
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository], // Export the repository here
})
export class UserModule {}

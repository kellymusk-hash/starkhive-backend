import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuditModule } from '@src/audit/audit.module';
import { Content } from '@src/content Entity/entities/content.entity';
import { Report } from '@src/reporting/entities/report.entity';
import { AuditLog } from '@src/audit/entitites/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Content,Report,AuditLog]),AuditModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { JobPosting } from './job-postings/entities/job-posting.entity';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionService } from './auth/services/permission.service';
import { PermissionGuard } from './auth/guards/permissions.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production', '.env.test'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [JobPosting],
      synchronize: true, // Automatically create tables (disable in production)
    }),
    JobPostingsModule,
  ],
  controllers: [],
  providers: [RolesGuard, PermissionGuard, PermissionService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware);
  }
}

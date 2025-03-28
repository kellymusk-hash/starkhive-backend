/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionService } from './auth/services/permission.service';
import { PermissionGuard } from './auth/guards/permissions.guard';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { ContractModule } from './contract/contract.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationSettingsModule } from './notification-settings/notification-settings.module';
import { FreelancerProfileModule } from './freelancer-profile/freelancer-profile.module';
import { PostService } from './post/post.service';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { PostModule } from './post/post.module';
import { ReportsModule } from './reports/reports.module';
import { EndorsementModule } from './endorsement/endorsement.module';
import { ProjectModule } from './project/project.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { SearchModule } from './search/search.module';
import { CommentModule } from './comment/comment.module';
import { MessagingModule } from './messaging/messaging.module';
import { ErrorTrackingModule } from './error-tracking/error-tracking.module';
import { ErrorTrackingMiddleware } from './error-tracking/middleware/error-tracking.middleware';
import { ReputationModule } from './reputation/reputation.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { SkillsModule } from './skills/skills.module';
import { AnonymizationModule } from './anonymization/anonymization.module';
dotenv.config();

@Module({
    imports: [
        // Load environment variables globally
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development', '.env.production', '.env.test'],
        }),

        // Configure TypeORM with environment variables
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                synchronize: configService.get<string>('NODE_ENV') !== 'production',
                autoLoadEntities: true,
            }),
        }),

        // Import modules
        AuthModule,
        ConversationsModule,
        JobPostingsModule,
        CompanyModule,
        UserModule,
        ContractModule,
        PaymentModule,
        NotificationsModule,
        NotificationSettingsModule,
        FreelancerProfileModule,
        PostModule,
        ReportsModule,
        EndorsementModule,
        ProjectModule,
        TimeTrackingModule,
        SearchModule,
        CommentModule,
        MessagingModule,
        ErrorTrackingModule,
        AttachmentsModule,
        WebsocketsModule,
        ReputationModule,
        BlockchainModule,
        SkillsModule,
        AnonymizationModule
    ],
    providers: [
        RolesGuard,
        PermissionGuard,
        PermissionService,
        PostService,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply error tracking middleware first to catch all errors
        consumer
            .apply(ErrorTrackingMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });

        // Apply other middleware
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UtilService } from './utils/utils.function';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity'; // Adjust path if needed
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { LinkedInStrategy } from './strategies/linkedin.strategy';
import { PassportSerializer } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Ensure User is part of this module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UtilService,
    GoogleStrategy,
    GitHubStrategy,
    LinkedInStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UtilService } from './utils/utils.function';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/user/repositories/user.repositories';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, UtilService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

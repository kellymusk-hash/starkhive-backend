import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UtilService } from './utils/utils.function';
import { UserRepository } from '@src/user/repositories/user.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserRepository])
    ],
    providers: [AuthService, JwtStrategy, UtilService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}

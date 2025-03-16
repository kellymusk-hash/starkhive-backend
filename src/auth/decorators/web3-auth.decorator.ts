import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const WEB3_AUTH_KEY = 'web3_auth';

export function Web3Auth() {
    return applyDecorators(
        SetMetadata(WEB3_AUTH_KEY, true),
        UseGuards(JwtAuthGuard)
    );
}

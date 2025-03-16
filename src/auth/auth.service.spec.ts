import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { hash } from 'starknet';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('starknet', () => ({
    hash: {
        starknetKeccak: jest.fn()
    }
}));

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock.jwt.token'),
        verify: jest.fn().mockReturnValue({ sub: 'mockWalletAddress' }),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('mock_secret'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateAuthMessage', () => {
        it('should generate a message with nonce', async () => {
            const walletAddress = '0x123...';
            const result = await service.generateAuthMessage(walletAddress);

            expect(result).toHaveProperty('message');
            expect(result).toHaveProperty('nonce');
            expect(result.message).toContain('Welcome to StarkHive!');
            expect(result.message).toContain('Nonce:');
        });
    });

    describe('verifySignature', () => {
        const mockWalletAddress = '0x123...';
        const mockSignature = ['0x456...', '0x789...'];
        const mockMessage = 'Test message';

        beforeEach(() => {
            // Reset the mock before each test
            (hash.starknetKeccak as jest.Mock).mockReset();
        });

        it('should verify valid signature', async () => {
            // Mock starknetKeccak to return a non-zero BigInt
            (hash.starknetKeccak as jest.Mock).mockReturnValue(BigInt('0x123'));

            const result = await service.verifySignature(
                mockWalletAddress,
                mockSignature,
                mockMessage
            );

            expect(result).toBe(true);
            expect(hash.starknetKeccak).toHaveBeenCalledWith(mockMessage);
        });

        it('should throw on invalid signature format', async () => {
            await expect(
                service.verifySignature(
                    mockWalletAddress,
                    ['invalid', 'signature'],
                    mockMessage
                )
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should return false for zero hash', async () => {
            // Mock starknetKeccak to return zero
            (hash.starknetKeccak as jest.Mock).mockReturnValue(BigInt(0));

            const result = await service.verifySignature(
                mockWalletAddress,
                mockSignature,
                mockMessage
            );

            expect(result).toBe(false);
        });
    });

    describe('generateToken', () => {
        it('should generate JWT token', async () => {
            const walletAddress = '0x123...';
            const token = await service.generateToken(walletAddress);

            expect(token).toBe('mock.jwt.token');
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: walletAddress });
        });
    });

    describe('validateToken', () => {
        it('should validate and return token payload', async () => {
            const token = 'valid.jwt.token';
            const result = await service.validateToken(token);

            expect(result).toEqual({ sub: 'mockWalletAddress' });
            expect(jwtService.verify).toHaveBeenCalledWith(token);
        });

        it('should throw on invalid token', async () => {
            mockJwtService.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });

            await expect(service.validateToken('invalid.token'))
                .rejects.toThrow(UnauthorizedException);
        });
    });
});

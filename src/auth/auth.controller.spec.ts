import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const mockAuthService = {
        generateAuthMessage: jest.fn().mockImplementation((walletAddress) => ({
            message: 'Test message',
            nonce: '123456',
        })),
        verifySignature: jest.fn().mockResolvedValue(true),
        generateToken: jest.fn().mockResolvedValue('mock.jwt.token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('connectWallet', () => {
        it('should generate auth message for valid wallet address', async () => {
            const walletAddress = '0x123...';
            const result = await controller.connectWallet(walletAddress);

            expect(result).toEqual({
                message: 'Test message',
                nonce: '123456',
            });
            expect(mockAuthService.generateAuthMessage).toHaveBeenCalledWith(
                walletAddress,
            );
        });

        it('should throw UnauthorizedException for missing wallet address', async () => {
            await expect(controller.connectWallet('')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('verifyWallet', () => {
        const mockVerifyData = {
            walletAddress: '0x123...',
            signature: ['sig1', 'sig2'],
            message: 'Test message',
        };

        it('should verify signature and return token', async () => {
            const result = await controller.verifyWallet(mockVerifyData);

            expect(result).toEqual({ token: 'mock.jwt.token' });
            expect(mockAuthService.verifySignature).toHaveBeenCalledWith(
                mockVerifyData.walletAddress,
                mockVerifyData.signature,
                mockVerifyData.message,
            );
            expect(mockAuthService.generateToken).toHaveBeenCalledWith(
                mockVerifyData.walletAddress,
            );
        });

        it('should throw UnauthorizedException for invalid signature', async () => {
            mockAuthService.verifySignature.mockResolvedValueOnce(false);

            await expect(controller.verifyWallet(mockVerifyData)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});

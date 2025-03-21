import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { ConfigService } from '@nestjs/config';
import { TransactionLogService } from '../transaction-log.service';
import axios from 'axios';
import * as crypto from 'crypto';

jest.mock('axios');

describe('PaymentService', () => {
  let service: PaymentService;
  let configService: ConfigService;
  let transactionLogService: TransactionLogService;

  beforeEach(async () => {
    const mockTransactionLogService = {
      logTransaction: jest.fn().mockResolvedValue({}),
      updateTransaction: jest.fn().mockResolvedValue({}),
      logWebhook: jest.fn().mockResolvedValue({}),
      logCallback: jest.fn().mockResolvedValue({}),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'PAYSTACK_SECRET_KEY') return 'test_secret_key';
        if (key === 'CALLBACK_URL') return 'https://test.com/payment/callback';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TransactionLogService, useValue: mockTransactionLogService },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    configService = module.get<ConfigService>(ConfigService);
    transactionLogService = module.get<TransactionLogService>(TransactionLogService);
  });

  it('should initialize payment', async () => {
    const mockAxiosResponse = {
      data: {
        status: true,
        data: {
          reference: 'ref123',
          authorization_url: 'https://checkout.paystack.com/123456',
        },
      },
    };
    jest.spyOn(axios, 'post').mockResolvedValue(mockAxiosResponse);

    const result = await service.initializePayment({
      email: 'test@example.com',
      amount: 500,
      userId: 'user123',
      purpose: 'contract',
    });

    expect(result.status).toBe(true);
    expect(result.data.reference).toBe('ref123');
    expect(transactionLogService.logTransaction).toHaveBeenCalled();
    expect(transactionLogService.updateTransaction).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.paystack.co/transaction/initialize',
      expect.objectContaining({
        email: 'test@example.com',
        amount: 50000, // 500 * 100
      }),
      expect.objectContaining({
        headers: { Authorization: 'Bearer test_secret_key' },
      }),
    );
  });

  it('should verify payment', async () => {
    const mockAxiosResponse = {
      data: {
        status: true,
        data: {
          reference: 'ref123',
          status: 'success',
          amount: 50000,
          paid_at: '2023-01-01T12:00:00Z',
        },
      },
    };
    jest.spyOn(axios, 'get').mockResolvedValue(mockAxiosResponse);

    const result = await service.verifyPayment('ref123');

    expect(result.status).toBe(true);
    expect(result.data.reference).toBe('ref123');
    expect(transactionLogService.updateTransaction).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.paystack.co/transaction/verify/ref123',
      expect.objectContaining({
        headers: { Authorization: 'Bearer test_secret_key' },
      }),
    );
  });

  it('should reject invalid webhook signatures', async () => {
    const payload = { event: 'charge.success', data: { reference: 'ref123' } };
    const invalidSignature = 'invalid_signature';

    await expect(service.handleWebhook(invalidSignature, payload)).rejects.toThrow();
  });

  it('should process webhook with valid signature', async () => {
    const payload = { event: 'charge.success', data: { reference: 'ref123' } };
    
    // Mock the crypto function to return a known value
    const mockHash = 'valid_hash';
    jest.spyOn(crypto, 'createHmac').mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockHash),
    } as any);

    const result = await service.handleWebhook(mockHash, payload);

    expect(result.message).toBe('Webhook received successfully');
    expect(transactionLogService.logWebhook).toHaveBeenCalled();
  });
});
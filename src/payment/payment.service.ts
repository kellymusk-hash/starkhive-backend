import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';

@Injectable()
export class PaymentService {
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async initializePayment(createPaymentDto: CreatePaymentDto) {
    try {
      // Fetch the user entity
      const user = await this.paymentRepository.findOne({
        where: { id: createPaymentDto.userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Initialize payment with Paystack API
      const response = await axios.post<{
        status: boolean;
        data: { reference: string };
      }>(
        'https://api.paystack.co/transaction/initialize',
        {
          email: createPaymentDto.email,
          amount: createPaymentDto.amount * 100, // Convert to kobo
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      if (response.data.status) {
        // Create and save the payment object with full user
        const payment = this.paymentRepository.create({
          user, // Full User object
          amount: createPaymentDto.amount,
          transactionReference: response.data.data.reference, // Use the correct field name
          status: 'pending',
        });

        await this.paymentRepository.save(payment);
        return response.data;
      } else {
        throw new HttpException(
          'Payment initialization failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Error initializing payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get<{ status: boolean; data: any }>(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      if (response.data.status) {
        const payment = await this.paymentRepository.findOne({
          where: { transactionReference: reference }, // Use the correct column name
        });

        if (!payment) {
          throw new HttpException(
            'Payment record not found',
            HttpStatus.NOT_FOUND,
          );
        }

        payment.status = response.data.data.status;
        await this.paymentRepository.save(payment);

        return response.data;
      } else {
        throw new HttpException(
          'Payment verification failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Error verifying payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPaymentsByContract(contractId: string, userId?: string) {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.contractId = :contractId', { contractId });

    if (userId) {
      query.andWhere('payment.userId = :userId', { userId });
    }

    return query.getMany();
  }

  async getPaymentByReference(reference: string) {
    const payment = await this.paymentRepository.findOne({
      where: { transactionReference: reference }, // Use the correct column name
    });

    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    return payment;
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string) {
    const result = await this.paymentRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Payment deleted successfully' };
  }

  async handleWebhook(signature: string, payload: any) {
    // Implement your webhook logic here
    console.log('Webhook received', signature, payload);
    return { message: 'Webhook processed successfully' };
  }

  async handleCallback(reference: string) {
    // Implement your callback handling logic
    console.log('Callback received for reference:', reference);
    return { status: 'success' }; // or 'failed' based on verification
  }

  async generateInvoice(generateInvoiceDto: GenerateInvoiceDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      amount: generateInvoiceDto.amount,
      currency: 'USD', // or get from config
      status: 'pending',
      email: generateInvoiceDto.timeEntry.freelancer.email,
      metadata: JSON.stringify({
        timeEntryId: generateInvoiceDto.timeEntry.id,
        projectId: generateInvoiceDto.projectId,
        description: generateInvoiceDto.description
      }),
      contract: generateInvoiceDto.timeEntry.project.contract,
      user: generateInvoiceDto.timeEntry.freelancer
    });

    return this.paymentRepository.save(payment);
  }
}

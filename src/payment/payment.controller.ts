import { Controller, Get, Post, Body, Param, Headers, UseGuards, Res, HttpStatus, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';
import { PermissionGuard } from 'src/auth/guards/permissions.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(PermissionGuard)
  @Post('initialize')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.initializePayment(createPaymentDto);
  }

  @UseGuards(PermissionGuard)
  @Get('verify/:reference')
  async verify(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  @Post('webhook')
  async handleWebhook(@Headers('x-paystack-signature') signature: string, @Body() payload: any) {
    return this.paymentService.handleWebhook(signature, payload);
  }

  @Get('callback')
  async handleCallback(@Param('reference') reference: string, @Res() res: Response) {
    const result = await this.paymentService.handleCallback(reference);
    
    if (result.status === 'success') {
      return res.status(HttpStatus.OK).redirect('/payment/success');
    } else {
      return res.status(HttpStatus.OK).redirect('/payment/failure');
    }
  }

  @Get('success')
  successPage() {
    return { message: 'Payment successful!' };
  }

  @Get('failure')
  failurePage() {
    return { message: 'Payment failed or was cancelled.' };
  }

  @UseGuards(PermissionGuard)
  @Get('contract/:contractId')
  async getPaymentsByContract(
    @Param('contractId') contractId: string,
    @Query('userId') userId: string,
  ) {
    return this.paymentService.getPaymentsByContract(contractId, userId);
  }

  @UseGuards(PermissionGuard)
  @Get(':reference')
  async getPaymentByReference(@Param('reference') reference: string) {
    return this.paymentService.getPaymentByReference(reference);
  }
}

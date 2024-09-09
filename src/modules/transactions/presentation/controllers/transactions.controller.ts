import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateMerchantTransactionUseCase } from '../../application/usecases/CreateMerchantTransaction/create-merchant-transaction.usecase';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createMerchantTransaction: CreateMerchantTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createTransaction(@Body() body: CreateTransactionDto) {
    await this.createMerchantTransaction.execute({
      merchantId: body.merchantId,
      description: body.description,
      paymentMethod: body.paymentMethod,
      amount: body.amount,
      cardNumber: body.cardNumber,
      cardHolder: body.cardHolder,
      cardExpirationDate: body.cardExpirationDate,
      cvv: body.cvv,
    });
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CommandNames,
  CreateTransactionCommand,
} from 'src/shared/events/commands';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createTransaction(@Body() body: CreateTransactionDto) {
    this.eventEmitter.emit(
      CommandNames.MerchantTransactionCreateRequest,
      new CreateTransactionCommand(
        undefined,
        undefined,
        body.merchantId,
        body.description,
        body.paymentMethod,
        body.amount,
        {
          cardNumber: body.cardNumber,
          cardHolder: body.cardHolder,
          cardExpirationDate: body.cardExpirationDate,
          cvv: body.cvv,
        },
      ),
    );
  }
}

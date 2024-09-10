import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHash } from 'node:crypto';
import {
  CommandNames,
  CreateTransactionCommand,
} from 'src/shared/events/commands';
import { IdempotencyKeyInterceptor } from 'src/shared/interceptors/idempotency.interceptor';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(IdempotencyKeyInterceptor)
  async createTransaction(
    @Headers('x-idempotency-key') idempotencyKey: string,
    @Body() body: CreateTransactionDto,
  ) {
    const transactionHash = this.generateRequestHash(idempotencyKey, body);
    this.eventEmitter.emit(
      CommandNames.MerchantTransactionCreateRequest,
      new CreateTransactionCommand(
        idempotencyKey,
        transactionHash,
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
    return {
      transactionHash,
    };
  }

  private generateRequestHash(idempotencyKey: string, body: any): string {
    const hashValue = {
      idempotencyKey,
      ...body,
    };
    return createHash('sha256').update(JSON.stringify(hashValue)).digest('hex');
  }
}

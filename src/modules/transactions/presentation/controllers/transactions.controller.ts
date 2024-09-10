import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CommandNames,
  CreateTransactionCommand,
} from 'src/shared/events/commands';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { createHash } from 'node:crypto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createTransaction(
    @Headers('x-idempotency-key') idempotencyKey: string,
    @Body() body: CreateTransactionDto,
  ) {
    // TODO: add validation
    if (!idempotencyKey)
      throw new BadRequestException('x-idempotency-key is required');
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

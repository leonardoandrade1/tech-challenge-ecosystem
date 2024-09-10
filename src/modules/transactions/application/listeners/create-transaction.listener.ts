import { Injectable } from '@nestjs/common';
import { CreateMerchantTransactionUseCase } from '../usecases/CreateMerchantTransaction/create-merchant-transaction.usecase';
import { OnEvent } from '@nestjs/event-emitter';
import {
  CommandNames,
  CreateTransactionCommand,
} from 'src/shared/events/commands';

@Injectable()
export class CreateTransactionListener {
  constructor(
    private readonly createMerchantTransaction: CreateMerchantTransactionUseCase,
  ) {}

  @OnEvent(CommandNames.MerchantTransactionCreateRequest, { async: true })
  async handleMerchantTransactionCreateRequest(
    command: CreateTransactionCommand,
  ) {
    await this.createMerchantTransaction.execute({
      merchantId: command.merchantId,
      idempotencyKey: command.idempotencyKey,
      transactionHash: command.transactionHash,
      description: command.description,
      paymentMethod: command.paymentMethod,
      amount: command.amount,
      cardNumber: command.card.cardNumber,
      cardHolder: command.card.cardHolder,
      cardExpirationDate: command.card.cardExpirationDate,
      cvv: command.card.cvv,
    });
  }
}

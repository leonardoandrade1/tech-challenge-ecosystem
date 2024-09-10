import { Injectable } from '@nestjs/common';
import { CreatePayableFromTransactionUseCase } from '../usecases/create-payable-from-transaction.usecase';
import { OnEvent } from '@nestjs/event-emitter';
import {
  NotificationNames,
  TransactionCreatedNotification,
} from 'src/shared/events/notifications';

@Injectable()
export class TransactionCreatedListener {
  constructor(
    private readonly createMerchantPayableFromTransaction: CreatePayableFromTransactionUseCase,
  ) {}

  @OnEvent(NotificationNames.MerchantTransactionCreated, { async: true })
  async handleMerchantTransactionCreated(
    event: TransactionCreatedNotification,
  ) {
    await this.createMerchantPayableFromTransaction.execute({
      transactionId: event.transactionId,
      transactionDate: event.transactionDate,
      merchantId: event.merchantId,
      paymentMethod: event.paymentMethod,
      amount: event.amount,
    });
  }
}

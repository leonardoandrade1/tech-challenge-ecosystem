import { Injectable } from '@nestjs/common';
import { MerchantTransactionRepository } from '../../../infra/repositories/merchant-transaction.repository';
import { PaymentMethod } from 'src/shared/domain/enums';
import { Card, MerchantTransaction } from 'src/shared/domain/models';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  NotificationNames,
  TransactionCreatedNotification,
} from 'src/shared/events/notifications';

export interface CreateMerchantTransactionParams {
  merchantId: string;
  idempotencyKey: string;
  transactionHash: string;
  description: string;
  paymentMethod: PaymentMethod;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  cardExpirationDate: string;
  cvv: string;
}

@Injectable()
export class CreateMerchantTransactionUseCase {
  constructor(
    private readonly merchantTransactionRepository: MerchantTransactionRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(params: CreateMerchantTransactionParams): Promise<number> {
    const card = Card.Create(
      params.cardNumber,
      params.cardHolder,
      params.cardExpirationDate,
      params.cvv,
    );
    const merchantTransaction = await this.merchantTransactionRepository.save(
      MerchantTransaction.New(
        params.merchantId,
        params.idempotencyKey,
        params.transactionHash,
        params.description,
        params.paymentMethod,
        params.amount,
        card,
      ),
    );
    const transactionCreated = new TransactionCreatedNotification(
      merchantTransaction,
    );
    this.eventEmitter.emit(
      NotificationNames.MerchantTransactionCreated,
      transactionCreated,
    );
    return merchantTransaction.id;
  }
}

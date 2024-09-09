import { Injectable } from '@nestjs/common';
import { MerchantTransactionRepository } from '../../../infra/repositories/merchant-transaction.repository';
import { PaymentMethod } from 'src/shared/domain/enums';
import { Card, MerchantTransaction } from 'src/shared/domain/models';

export interface CreateMerchantTransactionParams {
  merchantId: string;
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
        params.description,
        params.paymentMethod,
        params.amount,
        card,
      ),
    );
    return merchantTransaction.id;
  }
}

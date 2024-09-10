import { Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/shared/domain/enums';
import { MerchantPayable } from 'src/shared/domain/models';
import { MerchantPayableRepository } from '../../../infra/repositories/merchant-payable.repository';

export interface CreatePayableParams {
  transactionId: number;
  merchantId: string;
  transactionDate: Date;
  amount: number;
  paymentMethod: PaymentMethod;
}

@Injectable()
export class CreatePayableFromTransactionUseCase {
  constructor(private readonly payableRepository: MerchantPayableRepository) {}

  async execute(params: CreatePayableParams) {
    const payable = MerchantPayable.NewFromTransaction(
      params.merchantId,
      params.transactionId,
    );
    payable.calculateTransaction(
      params.paymentMethod,
      params.amount,
      params.transactionDate,
    );

    const result = await this.payableRepository.save(payable);
    return result.id;
  }
}

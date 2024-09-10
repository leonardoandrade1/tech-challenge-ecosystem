import { CreatePayableParams } from 'src/modules/payables/application/usecases/create-payable-from-transaction.usecase';
import { PaymentMethod } from 'src/shared/domain/enums';

export function generateCreatePayableParams(params?: any) {
  const dto: CreatePayableParams = {
    transactionId: params?.transactionId ?? 1,
    merchantId: params?.merchantId ?? '1001',
    transactionDate: params?.transactionDate ?? new Date(),
    paymentMethod: params?.paymentMethod ?? PaymentMethod.CreditCard,
    amount: params?.amount ?? 100,
  };
  return dto;
}

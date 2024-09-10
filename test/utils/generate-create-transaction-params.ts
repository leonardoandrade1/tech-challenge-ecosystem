import { CreateMerchantTransactionParams } from 'src/modules/transactions/application/usecases/CreateMerchantTransaction/create-merchant-transaction.usecase';
import { PaymentMethod } from 'src/shared/domain/enums';

export function generateCreateTransactionParams(params?: any) {
  const dto: CreateMerchantTransactionParams = {
    merchantId: params?.merchantId ?? '1001',
    idempotencyKey: params?.idempotencyKey ?? 'idempotency123',
    transactionHash: params?.transactionHash ?? 'hash123',
    description: params?.description ?? 'T-Shirt Black/M',
    paymentMethod: params?.paymentMethod ?? PaymentMethod.DebitCard,
    amount: params?.amount ?? 50,
    cardNumber: params?.cardNumber ?? '5468794910773649',
    cardHolder: params?.cardHolder ?? 'card holder name',
    cardExpirationDate: params?.cardExpirationDate ?? '04/2026',
    cvv: params?.cvv ?? '759',
  };
  return dto;
}

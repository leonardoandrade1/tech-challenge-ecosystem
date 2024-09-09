import { PaymentMethod } from 'src/shared/domain/enums';

export class CreateTransactionDto {
  merchantId: string;
  description: string;
  paymentMethod: PaymentMethod;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  cardExpirationDate: string;
  cvv: string;
}

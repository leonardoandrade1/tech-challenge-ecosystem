import { PaymentMethod } from 'src/shared/domain/enums';
import { MerchantTransaction } from 'src/shared/domain/models';

export class TransactionCreatedNotification {
  public readonly transactionId: number;
  public readonly transactionDate: Date;
  public readonly merchantId: string;
  public readonly amount: number;
  public readonly paymentMethod: PaymentMethod;

  constructor(transaction: MerchantTransaction) {
    this.transactionId = transaction.id;
    this.transactionDate = transaction.createdAt;
    this.merchantId = transaction.merchantId;
    this.amount = transaction.amount;
    this.paymentMethod = transaction.paymentMethod;
  }
}

import { PaymentMethod } from 'src/shared/domain/enums';

interface Card {
  readonly cardNumber: string;
  readonly cardHolder: string;
  readonly cardExpirationDate: string;
  readonly cvv: string;
}

export class CreateTransactionCommand {
  public readonly idempotencyKey: string;
  public readonly transactionHash: string;
  public readonly merchantId: string;
  public readonly description: string;
  public readonly paymentMethod: PaymentMethod;
  public readonly amount: number;
  public readonly card: Card;

  constructor(
    idempotencyKey: string,
    transactionHash: string,
    merchantId: string,
    description: string,
    paymentMethod: PaymentMethod,
    amount: number,
    card: Card,
  ) {
    this.idempotencyKey = idempotencyKey;
    this.transactionHash = transactionHash;
    this.merchantId = merchantId;
    this.description = description;
    this.paymentMethod = paymentMethod;
    this.amount = amount;
    this.card = card;
  }
}

import { BadRequestException, NotAcceptableException } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PayableStatus, PaymentMethod } from '../enums';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.typeorm';

@Entity('Payable')
export class MerchantPayable {
  static DEBIT_FEE = 0.02;
  static CREDIT_FEE = 0.04;
  static DAYS_TO_ADD_TO_CREDIT = 30;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchantId: string;

  @Column()
  transactionId: number;

  @Column()
  status: PayableStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  subTotal: number;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  discount: number;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  total: number;

  public static NewFromTransaction(
    merchantId: string,
    transactionId: number,
  ): MerchantPayable {
    if (!merchantId)
      throw new BadRequestException('cannot create payable with no merchantId');
    if (!transactionId)
      throw new BadRequestException(
        'cannot create payable with no transactionId',
      );

    const model = new MerchantPayable();
    model.merchantId = merchantId;
    model.transactionId = transactionId;
    return model;
  }

  calculateTransaction(
    paymentMethod: PaymentMethod,
    amount: number,
    transactionDate: Date,
  ): void {
    if (amount <= 0)
      throw new BadRequestException(
        'only positive values are accepted to calculate payable',
      );
    switch (paymentMethod) {
      case PaymentMethod.DebitCard:
        this.calculateDebit(amount, transactionDate);
        break;
      case PaymentMethod.CreditCard:
        this.calculateCredit(amount, transactionDate);
        break;

      default:
        throw new NotAcceptableException('payment method not acceptable');
    }
  }

  private calculateDebit(amount: number, transactionDate: Date): void {
    const discount = amount * MerchantPayable.DEBIT_FEE;
    const total = amount - discount;
    this.status = PayableStatus.Paid;
    this.createdAt = transactionDate;
    this.subTotal = amount;
    this.discount = discount;
    this.total = total;
  }

  private calculateCredit(amount: number, transactionDate: Date): void {
    transactionDate.setDate(
      transactionDate.getDate() + MerchantPayable.DAYS_TO_ADD_TO_CREDIT,
    );
    const discount = amount * MerchantPayable.CREDIT_FEE;
    const total = amount - discount;
    this.status = PayableStatus.WaitingFunds;
    this.createdAt = transactionDate;
    this.subTotal = amount;
    this.discount = discount;
    this.total = total;
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums';
import { Card } from './value-objects';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.typeorm';
import { BadRequestException } from '@nestjs/common';

@Entity('Transaction')
export class MerchantTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  merchantId: string;

  @Column()
  description: string;

  @Column()
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  amount: number;

  @Column(() => Card, { prefix: true })
  card: Card;

  @Column({ unique: true, nullable: false })
  idempotencyKey: string;

  @Column({ unique: true, nullable: false })
  transactionHash: string;

  static New(
    merchantId: string,
    idempotencyKey: string,
    transactionHash: string,
    description: string,
    paymentMethod: PaymentMethod,
    amount: number,
    card: Card,
  ): MerchantTransaction {
    if (!merchantId)
      throw new BadRequestException(
        'cannot create transaction with no merchant',
      );
    if (!idempotencyKey)
      throw new BadRequestException(
        'cannot create transaction with no idempotencyKey',
      );
    if (!transactionHash)
      throw new BadRequestException(
        'cannot create transaction with no transactionHash',
      );
    if (!description)
      throw new BadRequestException(
        'cannot create transaction with no description',
      );
    if (!paymentMethod)
      throw new BadRequestException(
        'cannot create transaction with no payment method attached',
      );
    if (amount <= 0)
      throw new BadRequestException(
        'transaction can be created with only positive values',
      );
    if (!card)
      throw new BadRequestException(
        'cannot create transaction with no card associated',
      );

    const model = new MerchantTransaction();
    model.merchantId = merchantId;
    model.idempotencyKey = idempotencyKey;
    model.transactionHash = transactionHash;
    model.description = description;
    model.paymentMethod = paymentMethod;
    model.amount = amount;
    model.card = card;
    return model;
  }
}

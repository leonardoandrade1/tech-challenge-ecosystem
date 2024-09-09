import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums';
import { Card } from './value-objects';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.typeorm';

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
}

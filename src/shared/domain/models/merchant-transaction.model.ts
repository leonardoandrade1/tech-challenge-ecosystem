import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums';

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

  @Column()
  amount: number;
}

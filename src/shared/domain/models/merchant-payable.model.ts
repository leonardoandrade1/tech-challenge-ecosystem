import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.typeorm';
import { PayableStatus } from '../enums';

@Entity('Payable')
export class MerchantPayable {
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
}

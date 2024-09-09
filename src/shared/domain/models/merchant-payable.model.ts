import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.typeorm';
import { PayableStatus } from '../enums';
import { BadRequestException } from '@nestjs/common';

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
}

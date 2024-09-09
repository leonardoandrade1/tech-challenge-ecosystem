import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from 'src/shared/domain/models';
import { MerchantTransactionRepository } from './infra/repositories/merchant-transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantTransaction])],
  controllers: [TransactionsController],
  providers: [
    //repositories
    MerchantTransactionRepository,
  ],
})
export class TransactionsModule {}

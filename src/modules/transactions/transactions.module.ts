import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from 'src/shared/domain/models';
import { MerchantTransactionRepository } from './infra/repositories/merchant-transaction.repository';
import { CreateMerchantTransactionUseCase } from './application/usecases/CreateMerchantTransaction/create-merchant-transaction.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantTransaction])],
  controllers: [TransactionsController],
  providers: [
    //repositories
    MerchantTransactionRepository,
    //usecases
    CreateMerchantTransactionUseCase,
  ],
})
export class TransactionsModule {}

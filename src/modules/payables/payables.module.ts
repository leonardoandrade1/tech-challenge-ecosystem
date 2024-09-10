import { Module } from '@nestjs/common';
import { PayablesController } from './presentation/controllers/payables.controller';
import { MerchantPayable } from 'src/shared/domain/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantPayableRepository } from './infra/repositories/merchant-payable.repository';
import { CreatePayableFromTransactionUseCase } from './application/usecases/CreatePayableFromTransaction/create-payable-from-transaction.usecase';
import { TransactionCreatedListener } from './application/listeners/transaction-created.listener';
import { FetchMerchantePayableByRangeUseCase } from './application/usecases/FetchMerchantPayableByDateRange/fetch-merchant-payable-by-range.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantPayable])],
  controllers: [PayablesController],
  providers: [
    //repositories
    MerchantPayableRepository,
    //usecases
    CreatePayableFromTransactionUseCase,
    FetchMerchantePayableByRangeUseCase,
    //listeners
    TransactionCreatedListener,
  ],
})
export class PayablesModule {}

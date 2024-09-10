import { Module } from '@nestjs/common';
import { PayablesController } from './payables.controller';
import { MerchantPayable } from 'src/shared/domain/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantPayableRepository } from './infra/repositories/merchant-payable.repository';
import { CreatePayableFromTransactionUseCase } from './application/usecases/create-payable-from-transaction.usecase';
import { TransactionCreatedListener } from './application/listeners/transaction-created.listener';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantPayable])],
  controllers: [PayablesController],
  providers: [
    //repositories
    MerchantPayableRepository,
    //usecases
    CreatePayableFromTransactionUseCase,
    //listeners
    TransactionCreatedListener,
  ],
})
export class PayablesModule {}

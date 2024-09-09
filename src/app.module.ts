import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { PayablesModule } from './modules/payables/payables.module';

@Module({
  imports: [SharedModule, TransactionsModule, PayablesModule],
})
export class AppModule {}

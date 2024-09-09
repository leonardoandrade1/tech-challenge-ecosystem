import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [SharedModule, TransactionsModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from 'src/shared/domain/models';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantTransaction])],
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsModule {}

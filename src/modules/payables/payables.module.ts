import { Module } from '@nestjs/common';
import { PayablesController } from './payables.controller';
import { MerchantPayable } from 'src/shared/domain/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantPayableRepository } from './infra/repositories/merchant-payable.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantPayable])],
  controllers: [PayablesController],
  providers: [
    //repositories
    MerchantPayableRepository,
  ],
})
export class PayablesModule {}

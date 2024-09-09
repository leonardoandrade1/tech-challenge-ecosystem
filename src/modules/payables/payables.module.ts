import { Module } from '@nestjs/common';
import { PayablesController } from './payables.controller';
import { MerchantPayable } from 'src/shared/domain/models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantPayable])],
  controllers: [PayablesController],
  providers: [],
})
export class PayablesModule {}

import { Module } from '@nestjs/common';
import { PayablesController } from './payables.controller';

@Module({
  controllers: [PayablesController],
  providers: [],
})
export class PayablesModule {}

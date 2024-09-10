import { Controller, Get, Param, Query } from '@nestjs/common';
import { FetchMerchantePayableByRangeUseCase } from '../../application/usecases/FetchMerchantPayableByDateRange/fetch-merchant-payable-by-range.usecase';

@Controller('payables')
export class PayablesController {
  constructor(
    private readonly fetchPayableByRange: FetchMerchantePayableByRangeUseCase,
  ) {}

  @Get('/merchant/:merchantId')
  async fetchPayablesByMerchantAndRange(
    @Param('merchantId') merchantId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ): Promise<any> {
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 31);

    return this.fetchPayableByRange.execute({
      merchantId,
      startDate: startDate ?? new Date(),
      endDate: endDate ?? defaultEndDate,
    });
  }
}

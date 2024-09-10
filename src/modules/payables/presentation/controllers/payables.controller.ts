import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { FetchMerchantePayableByRangeUseCase } from '../../application/usecases/FetchMerchantPayableByDateRange/fetch-merchant-payable-by-range.usecase';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('payables')
export class PayablesController {
  constructor(
    private readonly fetchPayableByRange: FetchMerchantePayableByRangeUseCase,
  ) {}

  @Get('/merchant/:merchantId')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
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

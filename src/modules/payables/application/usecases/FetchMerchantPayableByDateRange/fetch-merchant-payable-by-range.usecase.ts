import { Injectable } from '@nestjs/common';
import { MerchantPayableRepository } from 'src/modules/payables/infra/repositories/merchant-payable.repository';

interface FetchMerchantPayableByRangeParams {
  merchantId: string;
  startDate: Date;
  endDate: Date;
}

interface FetchMerchantPayableByRangeResponse {
  totalPaid: number;
  totalDiscounts: number;
  totalToBeReceived: number;
}

@Injectable()
export class FetchMerchantePayableByRangeUseCase {
  constructor(private readonly payableRepository: MerchantPayableRepository) {}

  async execute(
    params: FetchMerchantPayableByRangeParams,
  ): Promise<FetchMerchantPayableByRangeResponse> {
    const { totalPaid, totalDiscounts, totalToBeReceived } =
      await this.payableRepository.fetchPayablesByDateRange(
        params.merchantId,
        params.startDate,
        params.endDate,
      );
    return { totalPaid, totalDiscounts, totalToBeReceived };
  }
}

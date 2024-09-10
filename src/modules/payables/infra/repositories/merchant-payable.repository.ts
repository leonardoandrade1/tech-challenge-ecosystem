import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayableStatus } from 'src/shared/domain/enums';
import { MerchantPayable } from 'src/shared/domain/models';
import { Repository } from 'typeorm';

interface TotalPayableByRangeResponse {
  totalPaid: number;
  totalDiscounts: number;
  totalToBeReceived: number;
}
@Injectable()
export class MerchantPayableRepository extends Repository<MerchantPayable> {
  constructor(
    @InjectRepository(MerchantPayable)
    private readonly payableRepository: Repository<MerchantPayable>,
  ) {
    super(
      payableRepository.target,
      payableRepository.manager,
      payableRepository.queryRunner,
    );
  }

  async fetchPayablesByDateRange(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TotalPayableByRangeResponse> {
    const [totalPaid, totalDiscounts, totalToBeReceived] = await Promise.all([
      this.calculateTotalByRangeAndStatus(
        merchantId,
        startDate,
        endDate,
        PayableStatus.Paid,
      ),
      this.calculateTotalDiscountsByRange(merchantId, startDate, endDate),
      this.calculateTotalByRangeAndStatus(
        merchantId,
        startDate,
        endDate,
        PayableStatus.WaitingFunds,
      ),
    ]);
    return {
      totalPaid,
      totalDiscounts,
      totalToBeReceived,
    };
  }

  private async calculateTotalByRangeAndStatus(
    merchantId: string,
    startDate: Date,
    endDate: Date,
    status: PayableStatus,
  ): Promise<number> {
    const { total } = await this.payableRepository
      .createQueryBuilder('payableTotalPaid')
      .select('sum(payableTotalPaid.total)', 'total')
      .where('payableTotalPaid.merchantId = :merchantId', {
        merchantId,
      })
      .andWhere('payableTotalPaid.createdAt >= :startDate', {
        startDate,
      })
      .andWhere('payableTotalPaid.createdAt <= :endDate', {
        endDate,
      })
      .andWhere('payableTotalPaid.status = :status', {
        status,
      })
      .getRawOne();
    return Number(total) ?? 0;
  }

  private async calculateTotalDiscountsByRange(
    merchantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const { total } = await this.payableRepository
      .createQueryBuilder('payableTotalDiscounts')
      .select('sum(payableTotalDiscounts.discount)', 'total')
      .where('payableTotalDiscounts.merchantId = :merchantId', {
        merchantId,
      })
      .andWhere('payableTotalDiscounts.createdAt >= :startDate', {
        startDate,
      })
      .andWhere('payableTotalDiscounts.createdAt <= :endDate', {
        endDate,
      })
      .andWhere('payableTotalDiscounts.status = :status', {
        status: PayableStatus.Paid,
      })
      .getRawOne();
    return Number(total) ?? 0;
  }
}

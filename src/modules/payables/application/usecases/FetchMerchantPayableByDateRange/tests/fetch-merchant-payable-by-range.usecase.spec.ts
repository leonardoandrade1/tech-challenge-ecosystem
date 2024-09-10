import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantPayableRepository } from 'src/modules/payables/infra/repositories/merchant-payable.repository';
import { PaymentMethod } from 'src/shared/domain/enums';
import { MerchantPayable } from 'src/shared/domain/models';
import { generateCreatePayableParams } from 'test/utils/generate-create-payable-params';
import { CreatePayableFromTransactionUseCase } from '../../CreatePayableFromTransaction/create-payable-from-transaction.usecase';
import { FetchMerchantePayableByRangeUseCase } from '../fetch-merchant-payable-by-range.usecase';

describe('[INTEGRATION]', () => {
  let usecase: FetchMerchantePayableByRangeUseCase;
  let usecaseToSeedData: CreatePayableFromTransactionUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [MerchantPayable],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([MerchantPayable]),
      ],
      providers: [
        FetchMerchantePayableByRangeUseCase,
        CreatePayableFromTransactionUseCase,
        MerchantPayableRepository,
      ],
    }).compile();

    usecase = module.get(FetchMerchantePayableByRangeUseCase);
    usecaseToSeedData = module.get(CreatePayableFromTransactionUseCase);
  });

  describe('execute', () => {
    const debitTransactionsAmount = [100, 100];
    const totalDebitAmount = debitTransactionsAmount.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    const creditTransactionsAmount = [100];
    const totalCreditAmount = creditTransactionsAmount.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    const creditTranscationDate = new Date();
    creditTranscationDate.setDate(creditTranscationDate.getDate() - 27);

    it('should return calculated values paid discounts and values to be received by merchant', async () => {
      const params = [
        ...debitTransactionsAmount.map((amount) =>
          generateCreatePayableParams({
            amount,
            paymentMethod: PaymentMethod.DebitCard,
          }),
        ),
        ...creditTransactionsAmount.map((amount) =>
          generateCreatePayableParams({
            amount,
            paymentMethod: PaymentMethod.CreditCard,
            transactionDate: creditTranscationDate,
          }),
        ),
      ];
      //   SEED DATA
      await Promise.all(
        params.map((param) => usecaseToSeedData.execute(param)),
      );

      const merchantId = '1001';
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 15);

      const expectedPaid =
        totalDebitAmount - totalDebitAmount * MerchantPayable.DEBIT_FEE;
      const expectedDiscounts = totalDebitAmount * MerchantPayable.DEBIT_FEE;
      const expectedToBeReceived =
        totalCreditAmount - totalCreditAmount * MerchantPayable.CREDIT_FEE;

      const { totalPaid, totalDiscounts, totalToBeReceived } =
        await usecase.execute({
          merchantId,
          startDate,
          endDate,
        });

      expect(totalPaid).toEqual(expectedPaid);
      expect(totalDiscounts).toEqual(expectedDiscounts);
      expect(totalToBeReceived).toEqual(expectedToBeReceived);
    });

    it('should return paid, discounts and received values as zero when none was found by date range', async () => {
      const params = [
        ...debitTransactionsAmount.map((amount) =>
          generateCreatePayableParams({
            amount,
            paymentMethod: PaymentMethod.DebitCard,
          }),
        ),
        ...creditTransactionsAmount.map((amount) =>
          generateCreatePayableParams({
            amount,
            paymentMethod: PaymentMethod.CreditCard,
            transactionDate: creditTranscationDate,
          }),
        ),
      ];
      //   SEED DATA
      await Promise.all(
        params.map((param) => usecaseToSeedData.execute(param)),
      );

      const merchantId = '1001';
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 60);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 30);

      const { totalPaid, totalDiscounts, totalToBeReceived } =
        await usecase.execute({
          merchantId,
          startDate,
          endDate,
        });

      expect(totalPaid).toEqual(0);
      expect(totalDiscounts).toEqual(0);
      expect(totalToBeReceived).toEqual(0);
    });

    it('should return paid, discounts and received values as zero when none was found by merchantId', async () => {
      const params = [
        ...debitTransactionsAmount.map((amount) =>
          generateCreatePayableParams({
            amount,
            paymentMethod: PaymentMethod.DebitCard,
          }),
        ),
        ...creditTransactionsAmount.map((amount) =>
          generateCreatePayableParams({
            amount,
            paymentMethod: PaymentMethod.CreditCard,
            transactionDate: creditTranscationDate,
          }),
        ),
      ];
      //   SEED DATA
      await Promise.all(
        params.map((param) => usecaseToSeedData.execute(param)),
      );

      const merchantId = '1';
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 15);

      const { totalPaid, totalDiscounts, totalToBeReceived } =
        await usecase.execute({
          merchantId,
          startDate,
          endDate,
        });

      expect(totalPaid).toEqual(0);
      expect(totalDiscounts).toEqual(0);
      expect(totalToBeReceived).toEqual(0);
    });

    it('should return paid, discounts and received values as zero when none was found', async () => {
      const merchantId = '1001';
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 15);

      const { totalPaid, totalDiscounts, totalToBeReceived } =
        await usecase.execute({
          merchantId,
          startDate,
          endDate,
        });

      expect(totalPaid).toEqual(0);
      expect(totalDiscounts).toEqual(0);
      expect(totalToBeReceived).toEqual(0);
    });
  });
});

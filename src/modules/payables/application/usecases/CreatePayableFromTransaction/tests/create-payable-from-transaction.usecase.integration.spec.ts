import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantPayableRepository } from 'src/modules/payables/infra/repositories/merchant-payable.repository';
import { PaymentMethod } from 'src/shared/domain/enums';
import { MerchantPayable } from 'src/shared/domain/models';
import { generateCreatePayableParams } from 'test/utils/generate-create-payable-params';
import { Repository } from 'typeorm';
import { CreatePayableFromTransactionUseCase } from '../create-payable-from-transaction.usecase';

describe('[INTEGRATION] CreatePayableFromTransactionUseCase', () => {
  let usecase: CreatePayableFromTransactionUseCase;
  let payableRepoMock: Repository<MerchantPayable>;

  const fakeDate = new Date('2024-01-01T00:00:00.000Z');
  beforeAll(() => {
    jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(fakeDate);
  });

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
        CreatePayableFromTransactionUseCase,
        MerchantPayableRepository,
      ],
    }).compile();

    usecase = module.get(CreatePayableFromTransactionUseCase);
    payableRepoMock = module.get(MerchantPayableRepository);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('execute', () => {
    it('ensure credit payable is being calcualted and saved corretly', async () => {
      const params = generateCreatePayableParams({
        paymentMethod: PaymentMethod.CreditCard,
      });

      const expectedDiscount = params.amount * MerchantPayable.CREDIT_FEE;
      const expectedTotal = params.amount - expectedDiscount;
      const expectedPayableDate = new Date(params.transactionDate);
      expectedPayableDate.setDate(
        new Date().getDate() + MerchantPayable.DAYS_TO_ADD_TO_CREDIT,
      );
      const payableId = await usecase.execute(params);
      expect(payableId).toBeDefined();

      const payable = await payableRepoMock.findOneBy({ id: payableId });
      expect(payable.createdAt).toEqual(expectedPayableDate);
      expect(payable.subTotal).toEqual(params.amount);
      expect(payable.discount).toEqual(expectedDiscount);
      expect(payable.total).toEqual(expectedTotal);
    });
    it('ensure debit payable is being calcualted and saved corretly', async () => {
      const params = generateCreatePayableParams({
        paymentMethod: PaymentMethod.DebitCard,
      });

      const expectedDiscount = params.amount * MerchantPayable.DEBIT_FEE;
      const expectedTotal = params.amount - expectedDiscount;
      const payableId = await usecase.execute(params);
      expect(payableId).toBeDefined();

      const payable = await payableRepoMock.findOneBy({ id: payableId });
      expect(payable.createdAt).toEqual(params.transactionDate);
      expect(payable.subTotal).toEqual(params.amount);
      expect(payable.discount).toEqual(expectedDiscount);
      expect(payable.total).toEqual(expectedTotal);
    });
  });
});

import { createMock } from '@golevelup/ts-jest';
import { MerchantPayable, MerchantTransaction } from 'src/shared/domain/models';
import { Repository } from 'typeorm';
import { TransactionCreatedListener } from '../transaction-created.listener';
import { Test } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from 'src/shared/domain/enums';
import { TransactionCreatedNotification } from 'src/shared/events/notifications';
import { CreatePayableFromTransactionUseCase } from '../../usecases/create-payable-from-transaction.usecase';
import { MerchantPayableRepository } from 'src/modules/payables/infra/repositories/merchant-payable.repository';

describe('[INTEGRATION] TransactionCreatedListener', () => {
  let listener: TransactionCreatedListener;
  let payableRepository: Repository<MerchantPayable>;

  const fakeDate = new Date('2024-01-01T00:00:00.000Z');
  beforeAll(() => {
    jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(fakeDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
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
        MerchantPayableRepository,
        CreatePayableFromTransactionUseCase,
        TransactionCreatedListener,
      ],
    }).compile();

    listener = module.get(TransactionCreatedListener);
    payableRepository = module.get(MerchantPayableRepository);
  });

  describe('execute', () => {
    it('ensure credit transaction and payable are being saved correctly', async () => {
      const transactionMock = createMock<MerchantTransaction>({
        id: 1,
        merchantId: '123',
        createdAt: fakeDate,
        amount: 100,
        paymentMethod: PaymentMethod.DebitCard,
      });
      const transactionCreatedNotification = new TransactionCreatedNotification(
        transactionMock,
      );

      await listener.handleMerchantTransactionCreated(
        transactionCreatedNotification,
      );

      const payable = await payableRepository.findOneBy({
        transactionId: transactionMock.id,
      });
      expect(payable).toBeDefined();
      expect(payable).toBeInstanceOf(MerchantPayable);
      expect(payable.merchantId).toEqual(transactionMock.merchantId);
      expect(payable.subTotal).toEqual(transactionMock.amount);
    });
  });
});

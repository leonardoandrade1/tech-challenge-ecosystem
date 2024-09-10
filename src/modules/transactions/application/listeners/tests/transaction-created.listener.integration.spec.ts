import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransactionRepository } from 'src/modules/transactions/infra/repositories/merchant-transaction.repository';
import { MerchantTransaction } from 'src/shared/domain/models';
import { CreateTransactionCommand } from 'src/shared/events/commands';
import { generateCreateTransactionParams } from 'test/utils/generate-create-transaction-params';
import { Repository } from 'typeorm';
import { CreateMerchantTransactionUseCase } from '../../usecases/CreateMerchantTransaction/create-merchant-transaction.usecase';
import { CreateTransactionListener } from '../create-transaction.listener';

describe('[INTEGRATION] TransactionCreatedListener', () => {
  let listener: CreateTransactionListener;
  let transactionRepository: Repository<MerchantTransaction>;

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
          entities: [MerchantTransaction],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([MerchantTransaction]),
      ],
      providers: [
        MerchantTransactionRepository,
        MerchantTransaction,
        CreateMerchantTransactionUseCase,
        CreateTransactionListener,
      ],
    }).compile();

    listener = module.get(CreateTransactionListener);
    transactionRepository = module.get(MerchantTransactionRepository);
  });

  describe('execute', () => {
    it('ensure merchant transaction are being saved correctly', async () => {
      const params = generateCreateTransactionParams();
      const transactionCreatedNotification = new CreateTransactionCommand(
        'idempotency-key-test',
        'transaction-hash-test',
        params.merchantId,
        params.description,
        params.paymentMethod,
        params.amount,
        {
          cardNumber: params.cardNumber,
          cardHolder: params.cardHolder,
          cardExpirationDate: params.cardExpirationDate,
          cvv: params.cvv,
        },
      );

      await listener.handleMerchantTransactionCreateRequest(
        transactionCreatedNotification,
      );

      const transaction = await transactionRepository.findOneBy({
        merchantId: params.merchantId,
      });
      expect(transaction).toBeDefined();
      expect(transaction).toBeInstanceOf(MerchantTransaction);
      expect(transaction.merchantId).toEqual(params.merchantId);
      expect(transaction.amount).toEqual(params.amount);
      expect(transaction.card.numeration).toEqual(
        params.cardNumber.substring(params.cardNumber.length - 4),
      );
    });
  });
});

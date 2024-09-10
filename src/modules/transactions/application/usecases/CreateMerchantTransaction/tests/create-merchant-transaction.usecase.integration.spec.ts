import { Repository } from 'typeorm';
import { CreateMerchantTransactionUseCase } from '../create-merchant-transaction.usecase';
import { MerchantTransaction } from 'src/shared/domain/models';
import { Test } from '@nestjs/testing';
import { MerchantTransactionRepository } from 'src/modules/transactions/infra/repositories/merchant-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { generateCreateTransactionParams } from 'test/utils/generate-create-transaction-params';
import { PaymentMethod } from 'src/shared/domain/enums';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('[INTEGRATION] CreateMerchantTransactionUseCase', () => {
  let usecase: CreateMerchantTransactionUseCase;
  let transactionRepoMock: Repository<MerchantTransaction>;

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
        CreateMerchantTransactionUseCase,
        MerchantTransactionRepository,
      ],
    }).compile();

    usecase = module.get(CreateMerchantTransactionUseCase);
    transactionRepoMock = module.get(MerchantTransactionRepository);
  });

  describe('execute', () => {
    it('ensure merchant transaction with debit card is being saved correctly', async () => {
      const params = generateCreateTransactionParams();

      const transactionId = await usecase.execute(params);
      expect(transactionId).toBeDefined();

      const merchantTransaction = await transactionRepoMock.findOneBy({
        id: transactionId,
      });
      expect(merchantTransaction).toBeDefined();
      expect(merchantTransaction).toBeInstanceOf(MerchantTransaction);
      expect(merchantTransaction.merchantId).toEqual(params.merchantId);
      expect(merchantTransaction.paymentMethod).toEqual(params.paymentMethod);
      expect(merchantTransaction.amount).toEqual(params.amount);
      expect(merchantTransaction.card.numeration).toEqual(params.cardNumber);
    });
    it('ensure merchant transaction with credit card is being saved correctly', async () => {
      const params = generateCreateTransactionParams({
        paymentMethod: PaymentMethod.CreditCard,
      });

      const transactionId = await usecase.execute(params);
      expect(transactionId).toBeDefined();

      const merchantTransaction = await transactionRepoMock.findOneBy({
        id: transactionId,
      });
      expect(merchantTransaction).toBeDefined();
      expect(merchantTransaction).toBeInstanceOf(MerchantTransaction);
      expect(merchantTransaction.merchantId).toEqual(params.merchantId);
      expect(merchantTransaction.paymentMethod).toEqual(params.paymentMethod);
      expect(merchantTransaction.amount).toEqual(params.amount);
      expect(merchantTransaction.card.numeration).toEqual(params.cardNumber);
    });
  });
});

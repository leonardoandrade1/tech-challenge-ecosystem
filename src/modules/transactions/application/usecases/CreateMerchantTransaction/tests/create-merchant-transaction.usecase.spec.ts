import { createMock } from '@golevelup/ts-jest';
import { MerchantTransactionRepository } from 'src/modules/transactions/infra/repositories/merchant-transaction.repository';
import { MerchantTransaction } from 'src/shared/domain/models';
import { CreateMerchantTransactionUseCase } from '../create-merchant-transaction.usecase';
import { generateCreateTransactionParams } from 'test/utils/generate-create-transaction-params';

describe('CreateMerchantTransactionUseCase', () => {
  let usecase: CreateMerchantTransactionUseCase;
  let transactionRepoMock: MerchantTransactionRepository;

  beforeEach(async () => {
    transactionRepoMock = createMock<MerchantTransactionRepository>({
      save: jest.fn(),
    });

    usecase = new CreateMerchantTransactionUseCase(transactionRepoMock);
  });

  describe('execute', () => {
    it('should create transaction successfully', async () => {
      const dto = generateCreateTransactionParams();
      const transactionMock = createMock<MerchantTransaction>({
        id: 1,
        merchantId: dto.merchantId,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
      });
      const saveMockSpy = jest
        .spyOn(transactionRepoMock, 'save')
        .mockResolvedValueOnce(transactionMock);

      const result = await usecase.execute(dto);
      expect(result).toBeDefined();
      expect(result).toEqual(transactionMock.id);
      expect(saveMockSpy).toHaveBeenCalledTimes(1);
      expect(saveMockSpy).toHaveBeenCalledWith(expect.any(MerchantTransaction));
    });
  });
});

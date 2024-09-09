import { createMock } from '@golevelup/ts-jest';
import { MerchantTransactionRepository } from 'src/modules/transactions/infra/repositories/merchant-transaction.repository';
import {
  CreateMerchantTransactionParams,
  CreateMerchantTransactionUseCase,
} from '../create-merchant-transaction.usecase';
import { MerchantTransaction } from 'src/shared/domain/models';
import { PaymentMethod } from 'src/shared/domain/enums';

function generateCreateTransactionParams(params?: any) {
  const dto: CreateMerchantTransactionParams = {
    merchantId: params?.merchantId ?? '1001',
    description: params?.description ?? 'T-Shirt Black/M',
    paymentMethod: params?.paymentMethod ?? PaymentMethod.DebitCard,
    amount: params?.amount ?? 50,
    cardNumber: params?.cardNumber ?? '5468794910773649',
    cardHolder: params?.cardHolder ?? 'card holder name',
    cardExpirationDate: params?.cardExpirationDate ?? '04/2026',
    cvv: params?.cvv ?? '759',
  };
  return dto;
}

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

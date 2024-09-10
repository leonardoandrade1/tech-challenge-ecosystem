import { createMock } from '@golevelup/ts-jest';
import { MerchantTransactionRepository } from 'src/modules/transactions/infra/repositories/merchant-transaction.repository';
import { MerchantTransaction } from 'src/shared/domain/models';
import { CreateMerchantTransactionUseCase } from '../create-merchant-transaction.usecase';
import { generateCreateTransactionParams } from 'test/utils/generate-create-transaction-params';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  NotificationNames,
  TransactionCreatedNotification,
} from 'src/shared/events/notifications';

describe('CreateMerchantTransactionUseCase', () => {
  let usecase: CreateMerchantTransactionUseCase;
  let transactionRepoMock: MerchantTransactionRepository;
  let eventEmitterMock: EventEmitter2;

  beforeEach(async () => {
    transactionRepoMock = createMock<MerchantTransactionRepository>({
      save: jest.fn(),
    });
    eventEmitterMock = createMock<EventEmitter2>({
      emit: jest.fn(),
    });
    usecase = new CreateMerchantTransactionUseCase(
      transactionRepoMock,
      eventEmitterMock,
    );
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
      const emitEventSpy = jest.spyOn(eventEmitterMock, 'emit');

      const result = await usecase.execute(dto);
      expect(result).toBeDefined();
      expect(result).toEqual(transactionMock.id);
      expect(saveMockSpy).toHaveBeenCalledTimes(1);
      expect(saveMockSpy).toHaveBeenCalledWith(expect.any(MerchantTransaction));
      expect(emitEventSpy).toHaveBeenCalledTimes(1);
      expect(emitEventSpy).toHaveBeenCalledWith(
        NotificationNames.MerchantTransactionCreated,
        expect.any(TransactionCreatedNotification),
      );
    });
  });
});

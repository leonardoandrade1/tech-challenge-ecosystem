import { BadRequestException } from '@nestjs/common';
import { MerchantPayable } from '../merchant-payable.model';

describe('MerchantPayable', () => {
  describe('constructor', () => {
    const constructorTableTest = [
      {
        params: {
          merchantId: undefined,
          transactionId: 1,
        },
        message:
          'should return BadRequestException when trying to create a Payable with no merchantId',
        expectedError: BadRequestException,
      },
      {
        params: {
          merchantId: '123',
          transactionId: undefined,
        },
        message:
          'should return BadRequestException when trying to create a Payable with no transactionId',
        expectedError: BadRequestException,
      },
    ];
    it.each(constructorTableTest)('$message', ({ params, expectedError }) => {
      expect(() =>
        MerchantPayable.NewFromTransaction(
          params.merchantId,
          params.transactionId,
        ),
      ).toThrow(expectedError);
    });
    it('should create transaction successfully', () => {
      const params = {
        merchantId: '123',
        transactionId: 1,
      };
      expect(
        MerchantPayable.NewFromTransaction(
          params.merchantId,
          params.transactionId,
        ),
      ).toBeInstanceOf(MerchantPayable);
    });
  });
});

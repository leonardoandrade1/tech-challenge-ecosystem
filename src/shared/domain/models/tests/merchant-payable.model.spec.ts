import { BadRequestException } from '@nestjs/common';
import { PaymentMethod } from '../../enums';
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

  describe('calculateTransaction', () => {
    const fakeDate = new Date('2024-01-01T00:00:00.000Z');
    beforeAll(() => {
      jest
        .useFakeTimers({ doNotFake: ['performance'] })
        .setSystemTime(fakeDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw BadRequestException when trying to calculate transaction with negative or zero amount', () => {
      const params = {
        merchantId: '123',
        transactionId: 1,
        transactionDate: fakeDate,
        paymentMethod: PaymentMethod.DebitCard,
      };

      const payable = MerchantPayable.NewFromTransaction(
        params.merchantId,
        params.transactionId,
      );
      expect(() =>
        payable.calculateTransaction(
          params.paymentMethod,
          -1,
          params.transactionDate,
        ),
      ).toThrow(BadRequestException);
      expect(() =>
        payable.calculateTransaction(
          params.paymentMethod,
          0,
          params.transactionDate,
        ),
      ).toThrow(BadRequestException);
    });

    it('should calculate debit no adding days and discoutning correct fees', () => {
      const params = {
        merchantId: '123',
        transactionId: 1,
        amount: 100,
        transactionDate: fakeDate,
        paymentMethod: PaymentMethod.DebitCard,
      };

      const expectedDiscount = params.amount * MerchantPayable.DEBIT_FEE;
      const expectedTotal = params.amount - expectedDiscount;
      const payable = MerchantPayable.NewFromTransaction(
        params.merchantId,
        params.transactionId,
      );
      payable.calculateTransaction(
        params.paymentMethod,
        params.amount,
        params.transactionDate,
      );
      expect(payable.createdAt).toEqual(params.transactionDate);
      expect(payable.subTotal).toEqual(params.amount);
      expect(payable.discount).toEqual(expectedDiscount);
      expect(payable.total).toEqual(expectedTotal);
    });

    it('should calculate credit adding credit payable days and discoutning correct fees', () => {
      const params = {
        merchantId: '123',
        transactionId: 1,
        amount: 100,
        transactionDate: fakeDate,
        paymentMethod: PaymentMethod.CreditCard,
      };

      const expectedDiscount = params.amount * MerchantPayable.CREDIT_FEE;
      const expectedTotal = params.amount - expectedDiscount;
      const expectedPayableDate = new Date();
      expectedPayableDate.setDate(
        expectedPayableDate.getDate() + MerchantPayable.DAYS_TO_ADD_TO_CREDIT,
      );
      const payable = MerchantPayable.NewFromTransaction(
        params.merchantId,
        params.transactionId,
      );
      payable.calculateTransaction(
        params.paymentMethod,
        params.amount,
        params.transactionDate,
      );
      expect(payable.createdAt).toEqual(expectedPayableDate);
      expect(payable.subTotal).toEqual(params.amount);
      expect(payable.discount).toEqual(expectedDiscount);
      expect(payable.total).toEqual(expectedTotal);
    });
  });
});

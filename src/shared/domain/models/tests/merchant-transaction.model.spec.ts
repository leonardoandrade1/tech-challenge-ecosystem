import { BadRequestException } from '@nestjs/common';
import { PaymentMethod } from '../../enums';
import { MerchantTransaction } from '../merchant-transaction.model';
import { Card } from '../value-objects';

describe('MerchantTransaction', () => {
  const cardMock = Card.Create(
    '5105105105105100',
    'unit test',
    '09/2024',
    '111',
  );

  describe('constructor', () => {
    const constructorTableTest = [
      {
        params: {
          merchantId: undefined,
          descripion: 'unit test',
          paymentMethod: PaymentMethod.DebitCard,
          amount: 100,
          card: cardMock,
        },
        message:
          'should return BadRequestException when trying to create a Transaction with no merchantId',
        expectedError: BadRequestException,
      },
      {
        params: {
          merchantId: '123',
          descripion: undefined,
          paymentMethod: PaymentMethod.DebitCard,
          amount: 100,
          card: cardMock,
        },
        message:
          'should return BadRequestException when trying to create a Transaction with no description',
        expectedError: BadRequestException,
      },
      {
        params: {
          merchantId: '123',
          descripion: 'unit test',
          paymentMethod: undefined,
          amount: 100,
          card: cardMock,
        },
        message:
          'should return BadRequestException when trying to create a Transaction with no payment method',
        expectedError: BadRequestException,
      },
      {
        params: {
          merchantId: '123',
          descripion: 'unit test',
          paymentMethod: PaymentMethod.DebitCard,
          amount: 0,
          card: cardMock,
        },
        message:
          'should return BadRequestException when trying to create a Transaction with amount as zero',
        expectedError: BadRequestException,
      },
      {
        params: {
          merchantId: '123',
          descripion: 'unit test',
          paymentMethod: PaymentMethod.DebitCard,
          amount: -1,
          card: cardMock,
        },
        message:
          'should return BadRequestException when trying to create a Transaction with negative amount',
        expectedError: BadRequestException,
      },
      {
        params: {
          merchantId: '123',
          descripion: 'unit test',
          paymentMethod: PaymentMethod.DebitCard,
          amount: 100,
          card: undefined,
        },
        message:
          'should return BadRequestException when trying to create a Transaction with no card associated',
        expectedError: BadRequestException,
      },
    ];
    it.each(constructorTableTest)('$message', ({ params, expectedError }) => {
      expect(() =>
        MerchantTransaction.New(
          params.merchantId,
          params.descripion,
          params.paymentMethod,
          params.amount,
          params.card,
        ),
      ).toThrow(expectedError);
    });
    it('should create transaction successfully', () => {
      const params = {
        merchantId: '123',
        descripion: 'unit test',
        paymentMethod: PaymentMethod.DebitCard,
        amount: 100,
        card: cardMock,
      };
      expect(
        MerchantTransaction.New(
          params.merchantId,
          params.descripion,
          params.paymentMethod,
          params.amount,
          params.card,
        ),
      ).toBeInstanceOf(MerchantTransaction);
    });
  });
});

import { BadRequestException } from '@nestjs/common';
import { Card } from '../card.model';

describe('CardModel', () => {
  describe('constructor', () => {
    const constructorTableTest = [
      {
        params: {
          numeration: undefined,
          holder: 'unit test',
          expDate: '09/2024',
          cvv: '111',
        },
        message:
          'should return BadRequestException when truing to create a Card with no card numeration',
        expectedError: BadRequestException,
      },
      {
        params: {
          numeration: 5105105105105100,
          holder: undefined,
          expDate: '09/2024',
          cvv: '111',
        },
        message:
          'should return BadRequestException when truing to create a Card with no card holder name',
        expectedError: BadRequestException,
      },
      {
        params: {
          numeration: 5105105105105100,
          holder: 'unit test',
          expDate: undefined,
          cvv: '111',
        },
        message:
          'should return BadRequestException when truing to create a Card with no card expiration date',
        expectedError: BadRequestException,
      },
      {
        params: {
          numeration: 5105105105105100,
          holder: 'unit test',
          expDate: '09/2024',
          cvv: undefined,
        },
        message:
          'should return BadRequestException when truing to create a Card with no card cvv',
        expectedError: BadRequestException,
      },
    ];
    it.each(constructorTableTest)('$message', ({ params, expectedError }) => {
      expect(() =>
        Card.Create(
          params.numeration,
          params.holder,
          params.expDate,
          params.cvv,
        ),
      ).toThrow(expectedError);
    });
    it('should create card successfully', () => {
      const params = {
        numeration: '5105105105105100',
        holder: 'unit test',
        expDate: '09/2024',
        cvv: '111',
      };
      expect(
        Card.Create(
          params.numeration,
          params.holder,
          params.expDate,
          params.cvv,
        ),
      ).toBeInstanceOf(Card);
    });
  });
});

import { BadRequestException } from '@nestjs/common';
import { Column } from 'typeorm';

export class Card {
  @Column()
  numeration: string;

  @Column()
  holder: string;

  @Column()
  expirationDate: string;

  @Column()
  cvv: string;

  static Create(
    cardNumber: string,
    cardHolder: string,
    cardExpirationDate: string,
    cvv: string,
  ): Card {
    if (!cardNumber)
      throw new BadRequestException(
        'cannot create card with no provider card number',
      );
    if (!cardHolder)
      throw new BadRequestException(
        'cannot create card with no provider card holder',
      );
    if (!cardExpirationDate)
      throw new BadRequestException(
        'cannot create card with no provider card expiration date',
      );
    //TODO: add validacao para checar se cartao está expirado
    if (!cvv)
      throw new BadRequestException(
        'cannot create card with no provider card cvv',
      );
    const card = new Card();
    card.numeration = cardNumber.substring(cardNumber.length - 4);
    card.holder = cardHolder;
    card.expirationDate = cardExpirationDate;
    card.cvv = cvv;
    return card;
  }
}

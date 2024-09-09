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
}

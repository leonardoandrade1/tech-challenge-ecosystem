import {
  IsCreditCard,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaymentMethod } from 'src/shared/domain/enums';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsCreditCard()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  cardHolder: string;

  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/?(20[0-9]{2})$/, {
    message: 'Card expiration date must follow the pattern: DD/YYYY',
  })
  cardExpirationDate: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3)
  cvv: string;
}

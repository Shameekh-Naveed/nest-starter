import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  productID: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

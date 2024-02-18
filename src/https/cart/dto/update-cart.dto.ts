import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

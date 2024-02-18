import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNumber({}, { each: true })
  cartIDs: number[];
}

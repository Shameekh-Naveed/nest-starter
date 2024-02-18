import { ProductStatus, ProductType } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsUrl,
  Min,
  Max,
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
// import { ProductStatus } from 'src/enums/status.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  marketPrice: number;

  @IsNumber()
  @IsNotEmpty()
  costPrice: number;

  @IsUrl()
  @IsNotEmpty()
  picture: string;

  @IsNumber()
  @IsNotEmpty()
  minimumAge: number;

  @IsNumber()
  @IsNotEmpty()
  inventory: number;

  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsEnum(ProductType)
  @IsNotEmpty()
  productType: ProductType;
}

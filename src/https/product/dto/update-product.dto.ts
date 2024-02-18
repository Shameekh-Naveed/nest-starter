import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-product.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}

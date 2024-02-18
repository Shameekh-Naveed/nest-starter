import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { InventoryController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [InventoryController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}

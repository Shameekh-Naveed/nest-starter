import { Module } from '@nestjs/common';
import { InventoryService } from './product.service';
import { InventoryController } from './product.controller';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

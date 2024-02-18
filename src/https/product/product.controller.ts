import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateInventoryDto } from './dto/update-product.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/authorization/permissions/permissions.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { Status } from 'src/enums/status.enum';
import { FilterParameterPipe } from 'src/custom-pipes/filter-parameter.pipe';
import { PaginationPipe } from 'src/custom-pipes/pagination.pipe';
import { ProductStatus } from '@prisma/client';

@Controller('product')
export class InventoryController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @SetMetadata('roles', [[UserRole.ADMIN, Status.APPROVED]])
  @Post()
  async create(@Body() createInventoryDto: CreateProductDto) {
    const product = await this.productService.create(createInventoryDto);
    return {
      product: {
        id: product.id,
      },
    };
  }

  @SetMetadata('roles', [[]])
  @Get()
  findAll(
    @Query('limit', PaginationPipe) limit: number,
    @Query('page', PaginationPipe) page: number,
    @Query('name', FilterParameterPipe) name: string,
    @Query('minPrice', FilterParameterPipe) minPrice: number,
    @Query('maxPrice', FilterParameterPipe) maxPrice: number,
    @Query('minAge', FilterParameterPipe) minAge: number,
  ) {
    return this.productService.findAll(
      limit,
      page,
      name,
      minPrice,
      maxPrice,
      minAge,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(+id);
  }

  // TODO: Update product
  @UseGuards(JwtGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.productService.update(+id, updateInventoryDto);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @SetMetadata('roles', [[UserRole.ADMIN, Status.APPROVED]])
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(+id);
  }
}

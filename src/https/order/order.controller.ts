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
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/authorization/permissions/permissions.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { ExtendedRequest } from 'src/interfaces/extended-request';
import { Status } from '@prisma/client';
import { FilterParameterPipe } from 'src/custom-pipes/filter-parameter.pipe';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @SetMetadata('roles', [[UserRole.USER]])
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: ExtendedRequest) {
    const userID = req.user.user.id;
    return this.orderService.create(createOrderDto, userID);
  }

  @SetMetadata('roles', [[UserRole.ADMIN, Status.APPROVED]])
  @Get('admin')
  async findAll(
    @Query('productName', FilterParameterPipe) productName: string,
    @Query('customerName', FilterParameterPipe) customerName: string,
    @Query('date', FilterParameterPipe) date: string,
    @Query('email', FilterParameterPipe) email: string,
  ) {
    const orders = await this.orderService.findAll(
      productName,
      customerName,
      date,
      email,
    );
    return { orders };
  }

  // Get all orders of a user
  @SetMetadata('roles', [[UserRole.ADMIN, Status.APPROVED]])
  @Get('user/:id')
  async getAll(@Param('id', ParseIntPipe) id: number) {
    const orders = await this.orderService.userFindAll(id);
    return { orders };
  }

  @SetMetadata('roles', [[UserRole.USER]])
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    return { order };
  }

  // Get all orders of a user
  @SetMetadata('roles', [[UserRole.USER]])
  @Get()
  async userFindAll(@Req() req: ExtendedRequest) {
    const userID = req.user.user.id;
    const orders = await this.orderService.userFindAll(userID);
    return { orders };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}

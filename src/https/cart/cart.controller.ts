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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PermissionsGuard } from 'src/authorization/permissions/permissions.guard';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { ExtendedRequest } from 'src/interfaces/extended-request';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @SetMetadata('roles', [[UserRole.USER]])
  @Post()
  async create(
    @Body() createCartDto: CreateCartDto,
    @Req() req: ExtendedRequest,
  ) {
    const userID = req.user.user.id;
    const cart = await this.cartService.create(createCartDto, userID);
    return { cart: { id: cart.id } };
  }

  @SetMetadata('roles', [[UserRole.USER]])
  @Get()
  findAll(@Req() req: ExtendedRequest) {
    const userID = req.user.user.id;
    return this.cartService.findAll(userID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @SetMetadata('roles', [[UserRole.USER]])
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: ExtendedRequest,
  ) {
    const userID = req.user.user.id;
    return this.cartService.update(+id, updateCartDto, userID);
  }

  @SetMetadata('roles', [[UserRole.USER]])
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: ExtendedRequest) {
    const userID = req.user.user.id;
    return this.cartService.remove(+id, userID);
  }
}

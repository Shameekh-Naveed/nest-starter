import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CartStatus, OrderProduct } from '@prisma/client';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartService: CartService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userID: number) {
    const { cartIDs } = createOrderDto;
    const cart = await this.prismaService.cart.findMany({
      where: {
        userID,
        status: CartStatus.PENDING,
      },
    });

    if (!cart) throw new Error('No open cart found');

    const filteredCart = cart.filter((cartItem) =>
      cartIDs.includes(cartItem.id),
    );

    const order = await this.prismaService.order.create({
      data: {
        user: {
          connect: {
            id: userID,
          },
        },
      },
    });

    const orderItems = filteredCart.map((cart) => {
      return {
        order: {
          connect: {
            id: order.id,
          },
        },
        product: {
          connect: {
            id: cart.productID,
          },
        },
        quantity: cart.quantity,
        orderID: order.id,
        productID: cart.productID,
      };
    });

    await this.prismaService.orderProduct.createMany({
      data: orderItems,
    });

    this.cartService.updateCartStatus(cartIDs, CartStatus.COMPLETED);

    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

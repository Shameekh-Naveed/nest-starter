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

  async userFindAll(userID: number) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userID,
      },
      include: {
        OrderProduct: {
          include: {
            product: true,
          },
        },
      },
    });
    return orders;
  }

  async findOne(id: number) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id,
      },
      include: {
        OrderProduct: {
          include: {
            product: true,
          },
        },
      },
    });
    return order;
  }

  async findAll(
    productName: string,
    customerName: string,
    date: string,
    email: string,
  ) {
    // Constructing the query to find orders based on provided parameters
    const orders = await this.prismaService.order.findMany({
      where: {
        // Using logical OR operator to match any of the provided parameters
        OR: [
          // Match product name
          {
            OrderProduct: {
              some: {
                product: {
                  name: {
                    contains: productName,
                  },
                },
              },
            },
          },
          // Match customer name
          {
            user: {
              firstName: {
                contains: customerName,
              },
            },
          },
          // Match date
          {
            createdAt: {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000), // Assuming date parameter is for a single day
            },
          },
          // Match email
          {
            user: {
              email: {
                contains: email,
              },
            },
          },
        ],
      },
      include: {
        // Include related data such as products and users
        OrderProduct: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return orders;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

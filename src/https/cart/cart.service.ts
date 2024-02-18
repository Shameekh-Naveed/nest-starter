import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CartStatus } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCartDto: CreateCartDto, userID: number) {
    const { productID, quantity } = createCartDto;
    const cart = await this.prismaService.cart.create({
      data: {
        productID,
        quantity,
        status: CartStatus.PENDING,
        userID,
      },
    });
    return cart;
  }

  findAll(userID: number) {
    return this.prismaService.cart.findMany({
      where: {
        userID,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async findHeldQuantity(productID: number) {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const heldQuantity = await this.prismaService.cart.aggregate({
      where: {
        productID,
        status: CartStatus.PENDING,
        createdAt: {
          lte: fifteenMinutesAgo,
        },
      },
      _sum: {
        quantity: true,
      },
    });
    return heldQuantity._sum.quantity;
  }

  async update(id: number, updateCartDto: UpdateCartDto, userID: number) {
    const quantity = updateCartDto.quantity;
    if (quantity <= 0) await this.remove(id, userID);

    const record = await this.prismaService.cart.update({
      where: {
        id,
        userID,
      },
      data: {
        quantity,
      },
    });

    return record;
  }

  async updateCartStatus(cartIDs: number[], status: CartStatus) {
    const updated = await this.prismaService.cart.updateMany({
      where: {
        id: {
          in: cartIDs,
        },
      },
      data: {
        status,
      },
    });

    return updated;
  }

  async remove(id: number, userID: number) {
    const del = await this.prismaService.cart.delete({
      where: {
        id,
        userID,
      },
    });

    return del;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateInventoryDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';
import { CartService } from '../cart/cart.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartService: CartService,
  ) {}
  async create(createInventoryDto: CreateProductDto) {
    const {
      name,
      description,
      marketPrice,
      costPrice,
      picture,
      minimumAge,
      inventory,
      status,
      productType,
    } = createInventoryDto;
    const product = await this.prismaService.product.create({
      data: {
        name,
        description,
        marketPrice,
        costPrice,
        picture,
        minimumAge,
        inventory,
        status,
        productType,
      },
    });
    return product;
  }

  // TODO: Dk if the filter params are workingI + Dont want to give cost price to the user / use a select
  async findAll(
    limit: number,
    page: number,
    name: string,
    minPrice: number,
    maxPrice: number,
    minAge: number,
  ) {
    const products = await this.prismaService.product.findMany({
      where: {
        name: {
          contains: name,
        },
        marketPrice: {
          gte: minPrice,
          lte: maxPrice,
        },
        minimumAge: {
          gte: minAge,
        },
        status: {
          not: ProductStatus.DISCONTINUED,
        },
      },
      include: {
        Game: true,
        Gear: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return products;
  }

  // TODO: Dont want to give cost price to the user / use a select
  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        Game: true,
        Gear: true,
      },
    });
    const heldQuantity = await this.cartService.findHeldQuantity(id);
    product.inventory = heldQuantity;
    return product;
  }

  async getHeldQuantity(productID: number) {
    // const heldQuantity = await this.prismaService.inventory.findMany({
    //   where: {
    //     productID: productID,
    //     status: ProductStatus.HELD,
    //   },
    // });
    return 'heldQuantity';
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  async remove(id: number) {
    await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        status: ProductStatus.DISCONTINUED,
      },
    });
  }
}

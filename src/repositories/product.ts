import { left, right } from 'fp-either';
import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/prisma';
import { ProductRepository } from '@/types/repositories/product';
import { ProductRecord } from '@/types/records/product';
import { PictureRecord } from '@/types/records/picture';
import { StoreRecord } from '@/types/records/store';
import { ProductModel } from '@/models/product';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { NotFoundError } from '@/errors/not-found';

export function ProductRepository(): ProductRepository {
  const productMapper = ProductMapper();
  const storeMapper = StoreMapper();

  async function findManyByCity(cityId: string, page: number) {
    const limit = ProductModel.ITEMS_BY_PAGE;
    const offset = limit * (page - 1);
    const where: Prisma.ProductWhereInput = {
      status: 'active',
      store: {
        status: 'active',
        city_id: cityId,
      },
    };
    const products = await prisma.product.findMany({
      where: where,
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        store: true,
      },
    });
    const hasMore = await prisma.product.count({
      where: where,
      take: limit,
      skip: limit * page,
    });
    return {
      data: products.map((record) => ({
        ...productMapper.fromRecord({
          ...record,
          status: record.status as ProductRecord.Status,
          pictures: record.pictures as PictureRecord[],
        }),
        store: storeMapper.fromRecord({
          ...record.store,
          phone: record.store.phone as StoreRecord.Phone,
          status: record.store.status as StoreRecord.Status,
        }),
      })),
      hasMore: Boolean(hasMore),
    };
  }

  async function findOne(productId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        status: 'active',
        store: {
          status: 'active',
        },
      },
      include: {
        store: true,
      },
    });
    if (!product) return left(new NotFoundError('Product not found'));
    return right({
      ...productMapper.fromRecord({
        ...product,
        status: product.status as ProductRecord.Status,
        pictures: product.pictures as PictureRecord[],
      }),
      store: storeMapper.fromRecord({
        ...product.store,
        phone: product.store.phone as StoreRecord.Phone,
        status: product.store.status as StoreRecord.Status,
      }),
    });
  }

  async function findManyByStore(storeId: string, page: number) {
    const limit = ProductModel.ITEMS_BY_PAGE;
    const offset = limit * (page - 1);
    const where: Prisma.ProductWhereInput = {
      status: 'active',
      store: {
        id: storeId,
        status: 'active',
      },
    };
    const products = await prisma.product.findMany({
      where: where,
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    });
    const hasMore = await prisma.product.count({
      where: where,
      take: limit,
      skip: limit * page,
    });
    return {
      data: products.map((product) =>
        productMapper.fromRecord({
          ...product,
          status: product.status as ProductRecord.Status,
          pictures: product.pictures as PictureRecord[],
        }),
      ),
      hasMore: Boolean(hasMore),
    };
  }

  return {
    findManyByCity: findManyByCity,
    findOne: findOne,
    findManyByStore: findManyByStore,
  };
}

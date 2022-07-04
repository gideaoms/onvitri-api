import { left, right } from 'fp-either';
import { Prisma } from '@prisma/client';
import { StoreRepository } from '@/types/repositories/store';
import { ProductRecord } from '@/types/records/product';
import { PictureRecord } from '@/types/records/picture';
import { StoreRecord } from '@/types/records/store';
import { StoreModel } from '@/models/store';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { NotFoundError } from '@/errors/not-found';
import { prisma } from '@/libs/prisma';

export function StoreRepository(): StoreRepository {
  const productMapper = ProductMapper();
  const storeMapper = StoreMapper();
  const cityMapper = CityMapper();

  async function findOne(storeId: string) {
    const limit = StoreModel.ITEMS_BY_PAGE;
    const where: Prisma.StoreWhereInput = {
      id: storeId,
      status: 'active',
    };
    const store = await prisma.store.findFirst({
      where: where,
      include: {
        city: true,
        products: {
          where: {
            status: 'active',
          },
          orderBy: {
            created_at: 'desc',
          },
          take: limit,
        },
      },
    });
    if (!store) return left(new NotFoundError('Store not found'));
    const page = 1;
    const hasMore = await prisma.product.count({
      where: where,
      take: limit,
      skip: limit * page,
    });
    return right({
      ...storeMapper.fromRecord({
        ...store,
        phone: store.phone as StoreRecord.Phone,
        status: store.status as StoreRecord.Status,
      }),
      city: cityMapper.fromRecord(store.city),
      products: {
        data: store.products.map((product) =>
          productMapper.fromRecord({
            ...product,
            status: product.status as ProductRecord.Status,
            pictures: product.pictures as PictureRecord[],
          }),
        ),
        hasMore: Boolean(hasMore),
      },
    });
  }

  async function findManyByCity(cityId: string, page: number) {
    const limit = StoreModel.ITEMS_BY_PAGE;
    const offset = limit * (page - 1);
    const where: Prisma.StoreWhereInput = {
      status: 'active',
      city_id: cityId,
    };
    const stores = await prisma.store.findMany({
      where: where,
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        city: true,
      },
    });
    const hasMore = await prisma.store.count({
      where: where,
      take: limit,
      skip: limit * page,
    });
    return {
      data: stores.map((record) => ({
        ...storeMapper.fromRecord({
          ...record,
          phone: record.phone as StoreRecord.Phone,
          status: record.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(record.city),
      })),
      hasMore: Boolean(hasMore),
    };
  }

  return {
    findOne: findOne,
    findManyByCity: findManyByCity,
  };
}

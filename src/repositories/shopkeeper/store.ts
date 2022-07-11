import { left, right } from 'fp-either';
import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/prisma';
import { StoreRepository } from '@/types/repositories/shopkeeper/store';
import { StoreRecord } from '@/types/records/store';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { NotFoundError } from '@/errors/not-found';
import { StoreModel } from '@/models/store';

export function StoreRepository(): StoreRepository {
  const storeMapper = StoreMapper();
  const cityMapper = CityMapper();

  async function exists(storeId: string, ownerId: string) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        owner_id: ownerId,
      },
    });
    if (!store) return left(new NotFoundError('Store not found'));
    return right(
      storeMapper.fromRecord({
        ...store,
        phone: store.phone as StoreRecord.Phone,
        status: store.status as StoreRecord.Status,
      }),
    );
  }

  async function findMany(page: number, ownerId: string) {
    const limit = StoreModel.ITEMS_BY_PAGE;
    const offset = limit * (page - 1);
    const where: Prisma.StoreWhereInput = {
      owner_id: ownerId,
    };
    const orderBy: Prisma.StoreOrderByWithRelationInput = {
      created_at: 'desc',
    };
    const stores = await prisma.store.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        city: true,
      },
    });
    const hasMore = await prisma.store.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    });
    return {
      data: stores.map((store) => ({
        ...storeMapper.fromRecord({
          ...store,
          phone: store.phone as StoreRecord.Phone,
          status: store.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(store.city),
      })),
      hasMore: Boolean(hasMore),
    };
  }

  return {
    exists: exists,
    findMany: findMany,
  };
}

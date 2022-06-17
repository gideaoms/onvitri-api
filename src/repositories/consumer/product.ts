import { Prisma } from '@prisma/client';
import prisma from '@/libs/prisma';
import { ProductModel } from '@/models/product';
import { ProductRepository } from '@/types/repositories/consumer/product';
import { User } from '@/types/user';
import { ProductMapper } from '@/mappers/product';
import { ProductRecord } from '@/types/records/product';
import { PhotoRecord } from '@/types/records/photo';
import { StoreMapper } from '@/mappers/store';
import { StoreRecord } from '@/types/records/store';

export function ProductRepository(): ProductRepository {
  const productMapper = ProductMapper();
  const storeMapper = StoreMapper();

  async function findMany(page: number, user: User) {
    const limit = ProductModel.itemsByPage;
    const offset = limit * (page - 1);
    const where: Prisma.ProductWhereInput = {
      status: 'active',
      store: {
        status: 'active',
        followers: {
          some: {
            user_id: user.id,
          },
        },
      },
    };
    const products = await prisma.product.findMany({
      where: where,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        store: true,
      },
      take: limit,
      skip: offset,
    });
    const hasMore = await prisma.product.count({
      where: where,
      take: limit,
      skip: offset,
    });
    return {
      data: products.map((record) => ({
        ...productMapper.fromRecord({
          ...record,
          status: record.status as ProductRecord.Status,
          photos: record.photos as PhotoRecord[],
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

  return {
    findMany: findMany,
  };
}

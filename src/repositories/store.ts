import { left, right } from 'fp-either';
import { StoreRepository } from '@/types/repositories/store';
import { ProductRecord } from '@/types/records/product';
import { PhotoRecord } from '@/types/records/photo';
import { StoreRecord } from '@/types/records/store';
import StoreModel from '@/models/store';
import ProductMapper from '@/mappers/product';
import StoreMapper from '@/mappers/store';
import CityMapper from '@/mappers/city';
import prisma from '@/libs/prisma';
import NotFoundError from '@/errors/not-found';

function StoreRepository(): StoreRepository {
  const productMapper = ProductMapper();
  const storeMapper = StoreMapper();
  const cityMapper = CityMapper();

  async function findOne(storeId: string) {
    const limit = StoreModel.itemsLimit;
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
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
      where: {
        status: 'active',
      },
      take: limit,
      skip: limit * page,
    });
    return right({
      data: {
        ...storeMapper.fromRecord({
          ...store,
          phone: store.phone as StoreRecord.Phone,
          status: store.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(store.city),
        products: store.products.map((product) =>
          productMapper.fromRecord({
            ...product,
            status: product.status as ProductRecord.Status,
            photos: product.photos as PhotoRecord[],
          }),
        ),
      },
      hasMore: Boolean(hasMore),
    });
  }

  return {
    findOne,
  };
}

export default StoreRepository;

import { left, right } from 'fp-either';
import { StoreRepository } from '@/types/repositories/store';
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
    const limit = 12;
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
      take: limit,
      skip: limit * page,
    });
    return right({
      data: {
        ...storeMapper.fromRecord(store as any),
        city: cityMapper.fromRecord(store.city),
        products: store.products.map((product) => productMapper.fromRecord(product as any)),
      },
      hasMore: Boolean(hasMore),
    });
  }

  return {
    findOne,
  };
}

export default StoreRepository;

import { left, right } from 'fp-either';
import { IProductRepository } from '@/types/repositories/product';
import { ProductRecord } from '@/types/records/product';
import { PhotoRecord } from '@/types/records/photo';
import { StoreRecord } from '@/types/records/store';
import ProductModel from '@/models/product';
import ProductMapper from '@/mappers/product';
import StoreMapper from '@/mappers/store';
import prisma from '@/libs/prisma';
import NotFoundError from '@/errors/not-found';

function ProductRepository(): IProductRepository {
  const productMapper = ProductMapper();
  const storeMapper = StoreMapper();

  async function findMany(page: number) {
    const limit = ProductModel.itemsLimit;
    const offset = limit * (page - 1);
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        store: {
          status: 'active',
        },
      },
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
      where: {
        status: 'active',
        store: {
          status: 'active',
        },
      },
      take: limit,
      skip: limit * page,
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
        photos: product.photos as PhotoRecord[],
      }),
      store: storeMapper.fromRecord({
        ...product.store,
        phone: product.store.phone as StoreRecord.Phone,
        status: product.store.status as StoreRecord.Status,
      }),
    });
  }

  async function findManyByStore(storeId: string, page: number) {
    const limit = ProductModel.itemsLimit;
    const offset = limit * (page - 1);
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        store: {
          id: storeId,
          status: 'active',
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    });
    const hasMore = await prisma.product.count({
      where: {
        status: 'active',
        store: {
          id: storeId,
          status: 'active',
        },
      },
      take: limit,
      skip: limit * page,
    });
    return {
      data: products.map((product) =>
        productMapper.fromRecord({
          ...product,
          status: product.status as ProductRecord.Status,
          photos: product.photos as PhotoRecord[],
        }),
      ),
      hasMore: Boolean(hasMore),
    };
  }

  return {
    findMany,
    findOne,
    findManyByStore,
  };
}

export default ProductRepository;

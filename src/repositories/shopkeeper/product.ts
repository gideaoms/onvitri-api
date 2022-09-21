import { Prisma } from '@prisma/client';
import { failure, success } from '@/either';
import { prisma } from '@/libs/prisma';
import { IProductRepository } from '@/types/repositories/shopkeeper/product';
import { Product } from '@/types/product';
import { StoreRecord } from '@/types/records/store';
import { ProductRecord } from '@/types/records/product';
import { PictureRecord } from '@/types/records/picture';
import { ProductModel } from '@/models/product';
import { ProductMapper } from '@/mappers/product';
import { StoreMapper } from '@/mappers/store';
import { CityMapper } from '@/mappers/city';
import { NotFoundError } from '@/errors/not-found';
import { Store } from '@/types/store';

export function ProductRepository(): IProductRepository {
  const productMapper = ProductMapper();
  const storeMapper = StoreMapper();
  const cityMapper = CityMapper();

  async function findMany(ownerId: string, page: number, storeId: string) {
    const limit = ProductModel.ITEMS_BY_PAGE;
    const offset = limit * (page - 1);
    const where: Prisma.ProductWhereInput = {
      store: {
        id: storeId,
        owner_id: ownerId,
      },
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      created_at: 'desc',
    };
    const products = await prisma.product.findMany({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        store: {
          include: {
            city: true,
          },
        },
      },
    });
    const hasMore = await prisma.product.count({
      where: where,
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    });
    return {
      data: products.map((product) => ({
        ...productMapper.fromRecord({
          ...product,
          status: product.status as ProductRecord.Status,
          pictures: product.pictures as PictureRecord[],
        }),
        store: {
          ...storeMapper.fromRecord({
            ...product.store,
            phone: product.store.phone as StoreRecord.Phone,
            status: product.store.status as StoreRecord.Status,
          }),
          city: cityMapper.fromRecord(product.store.city),
        },
      })),
      hasMore: Boolean(hasMore),
    };
  }

  async function create(product: Product) {
    const [created] = await prisma.$transaction([
      prisma.product.create({
        data: productMapper.toRecord(product),
        include: {
          store: {
            include: {
              city: true,
            },
          },
        },
      }),
      prisma.store.update({
        where: {
          id: product.storeId,
        },
        data: {
          amount_active_products: {
            increment: 1,
          },
        },
      }),
    ]);
    return {
      ...productMapper.fromRecord({
        ...created,
        status: created.status as ProductRecord.Status,
        pictures: created.pictures as PictureRecord[],
      }),
      store: {
        ...storeMapper.fromRecord({
          ...created.store,
          phone: created.store.phone as StoreRecord.Phone,
          status: created.store.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(created.store.city),
      },
    };
  }

  async function exists(productId: string, ownerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: ownerId,
        },
      },
    });
    if (!product) return failure(new NotFoundError('Product not found'));
    return success(
      productMapper.fromRecord({
        ...product,
        status: product.status as ProductRecord.Status,
        pictures: product.pictures as PictureRecord[],
      }),
    );
  }

  async function update(product: Product, store: Store) {
    const [updated] = await prisma.$transaction([
      prisma.product.update({
        data: productMapper.toRecord(product),
        where: {
          id: product.id,
        },
        include: {
          store: {
            include: {
              city: true,
            },
          },
        },
      }),
      prisma.store.update({
        where: {
          id: product.storeId,
        },
        data: {
          amount_active_products: store.amountActiveProducts,
        },
      }),
    ]);
    return {
      ...productMapper.fromRecord({
        ...updated,
        status: updated.status as ProductRecord.Status,
        pictures: updated.pictures as PictureRecord[],
      }),
      store: {
        ...storeMapper.fromRecord({
          ...updated.store,
          phone: updated.store.phone as StoreRecord.Phone,
          status: updated.store.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(updated.store.city),
      },
    };
  }

  async function findOne(productId: string, ownerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: ownerId,
        },
      },
      include: {
        store: {
          include: {
            city: true,
          },
        },
      },
    });
    if (!product) return failure(new NotFoundError('Product not found'));
    return success({
      ...productMapper.fromRecord({
        ...product,
        status: product.status as ProductRecord.Status,
        pictures: product.pictures as PictureRecord[],
      }),
      store: {
        ...storeMapper.fromRecord({
          ...product.store,
          phone: product.store.phone as StoreRecord.Phone,
          status: product.store.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(product.store.city),
      },
    });
  }

  async function remove(product: Product) {
    await prisma.$transaction([
      prisma.product.delete({
        where: {
          id: product.id,
        },
      }),
      prisma.store.update({
        where: {
          id: product.storeId,
        },
        data: {
          amount_active_products: {
            decrement: 1,
          },
        },
      }),
    ]);
  }

  function countActiveByStore(storeId: string, ownerId: string) {
    return prisma.product.count({
      where: {
        store: {
          id: storeId,
          owner_id: ownerId,
          status: 'active',
        },
        status: 'active',
      },
    });
  }

  return {
    findMany: findMany,
    create: create,
    exists: exists,
    update: update,
    findOne: findOne,
    remove: remove,
    countActiveByStore: countActiveByStore,
  };
}

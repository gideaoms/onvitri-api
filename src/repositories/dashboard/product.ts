import { left, right } from 'fp-either'
import prisma from '@/libs/prisma'
import { ProductRepository } from '@/types/repositories/dashboard/product'
import { Product } from '@/types/product'
import ProductMapper from '@/mappers/product'
import StoreMapper from '@/mappers/store'
import CityMapper from '@/mappers/city'
import NotFoundError from '@/errors/not-found'
import { StoreRecord } from '@/types/records/store'
import { ProductRecord } from '@/types/records/product'
import { PhotoRecord } from '@/types/records/photo'

function ProductRepository(): ProductRepository {
  const productMapper = ProductMapper()
  const storeMapper = StoreMapper()
  const cityMapper = CityMapper()

  async function findMany(ownerId: string, page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const products = await prisma.product.findMany({
      where: {
        store: {
          owner_id: ownerId,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        store: {
          include: {
            city: true,
          },
        },
      },
    })
    const hasMore = await prisma.product.count({
      take: limit,
      skip: limit * page,
    })
    return {
      data: products.map((product) => ({
        ...productMapper.fromRecord({
          ...product,
          status: product.status as ProductRecord.Status,
          photos: product.photos as PhotoRecord[],
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
    }
  }

  async function create(product: Product) {
    const created = await prisma.product.create({
      data: productMapper.toRecord(product),
    })
    return productMapper.fromRecord({
      ...created,
      status: created.status as ProductRecord.Status,
      photos: created.photos as PhotoRecord[],
    })
  }

  async function exists(productId: string, ownerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          owner_id: ownerId,
        },
      },
    })
    if (!product) return left(new NotFoundError('Product not found'))
    return right(
      productMapper.fromRecord({
        ...product,
        status: product.status as ProductRecord.Status,
        photos: product.photos as PhotoRecord[],
      }),
    )
  }

  async function update(product: Product) {
    const updated = await prisma.product.update({
      data: productMapper.toRecord(product),
      where: {
        id: product.id,
      },
    })
    return productMapper.fromRecord({
      ...updated,
      status: updated.status as ProductRecord.Status,
      photos: updated.photos as PhotoRecord[],
    })
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
    })
    if (!product) return left(new NotFoundError('Product not found'))
    return right({
      ...productMapper.fromRecord({
        ...product,
        status: product.status as ProductRecord.Status,
        photos: product.photos as PhotoRecord[],
      }),
      store: {
        ...storeMapper.fromRecord({
          ...product.store,
          phone: product.store.phone as StoreRecord.Phone,
          status: product.store.status as StoreRecord.Status,
        }),
        city: cityMapper.fromRecord(product.store.city),
      },
    })
  }

  async function destroy(productId: string) {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    })
  }

  return {
    findMany,
    create,
    exists,
    update,
    findOne,
    destroy,
  }
}

export default ProductRepository

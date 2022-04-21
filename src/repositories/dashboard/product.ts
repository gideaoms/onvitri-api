import { left, right } from 'fp-either'
import prisma from '@/libs/prisma'
import { ProductRepository } from '@/types/repositories/dashboard/product'
import { Product } from '@/types/product'
import { Photo } from '@/types/photo'
import ProductMapper from '@/mappers/product'
import StoreMapper from '@/mappers/store'
import CityMapper from '@/mappers/city'
import NotFoundError from '@/errors/not-found'

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
      data: products.map((record) => ({
        ...productMapper.fromRecord(record as any),
        store: {
          ...storeMapper.fromRecord(record.store as any),
          city: cityMapper.fromRecord(record.store.city),
        },
      })),
      hasMore: Boolean(hasMore),
    }
  }

  async function create(product: Product) {
    const createdProduct = await prisma.product.create({
      data: productMapper.toRecord(product),
    })
    return productMapper.fromRecord(createdProduct as any)
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
        status: product.status as Product.Status,
        photos: product.photos as Photo[],
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
      status: updated.status as Product.Status,
      photos: updated.photos as Photo[],
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
    })
    if (!product) return left(new NotFoundError('Product not found'))
    return right(
      productMapper.fromRecord({
        ...product,
        status: product.status as Product.Status,
        photos: product.photos as Photo[],
      }),
    )
  }

  return {
    findMany,
    create,
    exists,
    update,
    findOne,
  }
}

export default ProductRepository

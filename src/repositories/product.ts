import { left, right } from 'fp-either'
import { ProductRepository } from '@/types/repositories/product'
import ProductMapper from '@/mappers/product'
import StoreMapper from '@/mappers/store'
import prisma from '@/libs/prisma'
import NotFoundError from '@/errors/not-found'

function ProductRepository(): ProductRepository {
  const productMapper = ProductMapper()
  const storeMapper = StoreMapper()

  async function findMany(page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        store: true,
      },
    })
    const hasMore = await prisma.product.count({
      take: limit,
      skip: limit * page,
    })
    return {
      data: products.map((record) => ({
        ...productMapper.fromRecord(record as any),
        store: storeMapper.fromRecord(record.store as any),
      })),
      hasMore: Boolean(hasMore),
    }
  }

  async function findOne(productId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        status: 'active',
      },
      include: {
        store: true,
      },
    })
    if (!product) return left(new NotFoundError('Product not found'))
    return right({
      ...productMapper.fromRecord(product as any),
      store: storeMapper.fromRecord(product.store as any),
    })
  }

  async function findManyByStore(storeId: string, page: number) {
    const limit = 10
    const offset = limit * (page - 1)
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        store_id: storeId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    })
    const hasMore = await prisma.product.count({
      take: limit,
      skip: limit * page,
    })
    return {
      data: products.map((product) => productMapper.fromRecord(product as any)),
      hasMore: Boolean(hasMore),
    }
  }

  return {
    findMany,
    findOne,
    findManyByStore,
  }
}

export default ProductRepository

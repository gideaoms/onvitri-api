import prisma from '@/libs/prisma'
import { ProductRepository } from '@/types/repositories/dashboard/product'
import { ProductModel } from '@/types/models/product'
import ProductMapper from '@/mappers/product'
import StoreMapper from '@/mappers/store'
import CityMapper from '@/mappers/city'

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

  async function create(product: ProductModel) {
    const createdProduct = await prisma.product.create({
      data: productMapper.toRecord(product),
    })
    return productMapper.fromRecord(createdProduct as any)
  }

  return {
    findMany,
    create,
  }
}

export default ProductRepository

import { prisma } from '@/libs/prisma'
import { Mappers } from '@/mappers'
import { Product } from '@/types/repositories/dashboard/product'

export function Product(): Product {
  const productMapper = Mappers.Product()
  const storeMapper = Mappers.Store()
  const cityMapper = Mappers.City()

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

  return {
    findMany,
  }
}

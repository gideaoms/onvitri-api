import { left, right } from 'fp-either'
import { Types } from '@/types'
import { prisma } from '@/libs/prisma'
import { Mappers } from '@/mappers'
import { Errors } from '@/errors'

function Store(): Types.Repositories.Store {
  const productMapper = Mappers.Product()
  const storeMapper = Mappers.Store()
  const cityMapper = Mappers.City()

  async function findOne(storeId: string) {
    const limit = 10
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
    })
    if (!store) return left(new Errors.NotFound('Store not found'))
    const page = 1
    const hasMore = await prisma.product.count({
      take: limit,
      skip: limit * page,
    })
    return right({
      data: {
        ...storeMapper.fromRecord(store as any),
        city: cityMapper.fromRecord(store.city),
        products: store.products.map((product) => productMapper.fromRecord(product as any)),
      },
      hasMore: Boolean(hasMore),
    })
  }

  return {
    findOne,
  }
}

export { Store }

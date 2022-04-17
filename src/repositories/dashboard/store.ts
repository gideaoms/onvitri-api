import { left, right } from 'fp-either'
import prisma from '@/libs/prisma'
import { StoreRepository } from '@/types/repositories/dashboard/store'
import StoreMapper from '@/mappers/store'

function StoreRepository(): StoreRepository {
  const storeMapper = StoreMapper()

  async function exists(storeId: string, ownerId: string) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        owner_id: ownerId,
      },
    })
    if (!store) return left(new Error('Store not found'))
    return right(storeMapper.fromRecord(store as any))
  }

  return {
    exists,
  }
}

export default StoreRepository

import { left, right } from 'fp-either'
import prisma from '@/libs/prisma'
import { StoreRepository } from '@/types/repositories/dashboard/store'
import { StoreRecord } from '@/types/records/store'
import StoreMapper from '@/mappers/store'
import CityMapper from '@/mappers/city'
import NotFoundError from '@/errors/not-found'

function StoreRepository(): StoreRepository {
  const storeMapper = StoreMapper()
  const cityMapper = CityMapper()

  async function exists(storeId: string, ownerId: string) {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        owner_id: ownerId,
      },
    })
    if (!store) return left(new NotFoundError('Store not found'))
    return right(
      storeMapper.fromRecord({
        ...store,
        phone: store.phone as StoreRecord.Phone,
        status: store.status as StoreRecord.Status,
      }),
    )
  }

  async function findMany(ownerId: string) {
    const stores = await prisma.store.findMany({
      where: {
        owner_id: ownerId,
      },
      include: {
        city: true,
      },
    })
    return stores.map((store) => ({
      ...storeMapper.fromRecord({
        ...store,
        phone: store.phone as StoreRecord.Phone,
        status: store.status as StoreRecord.Status,
      }),
      city: cityMapper.fromRecord(store.city),
    }))
  }

  return {
    exists,
    findMany,
  }
}

export default StoreRepository

import { Either } from 'fp-either'
import { Store } from '@/types/store'
import { City } from '@/types/city'
import NotFoundError from '@/errors/not-found'

export type StoreRepository = {
  exists(
    storeId: string,
    ownerId: string,
  ): Promise<Either<NotFoundError, Store>>
  findMany(ownerId: string): Promise<(Store & { city: City })[]>
}

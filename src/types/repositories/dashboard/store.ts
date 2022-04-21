import { Either } from 'fp-either'
import { Store } from '@/types/store'
import NotFoundError from '@/errors/not-found'

export type StoreRepository = {
  exists(
    storeId: string,
    ownerId: string,
  ): Promise<Either<NotFoundError, Store>>
}

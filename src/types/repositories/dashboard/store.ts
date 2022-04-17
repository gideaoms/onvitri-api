import { Either } from 'fp-either'
import { StoreModel } from '@/types/models/store'
import NotFoundError from '@/errors/not-found'

export type StoreRepository = {
  exists(storeId: string, ownerId: string): Promise<Either<NotFoundError, StoreModel>>
}

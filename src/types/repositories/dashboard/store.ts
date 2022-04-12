import { Either } from 'fp-either'
import { NotFound } from '@/errors/not-found'
import { Models } from '@/types/models'

export type Store = {
  findOne(storeId: string, ownerId: string): Promise<Either<NotFound, Models.Store>>
  findMany(ownerId: string, page: number): Promise<Models.Store.WithCity[]>
}

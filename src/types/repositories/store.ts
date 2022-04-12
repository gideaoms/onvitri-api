import { Either } from 'fp-either'
import { Types } from '@/types'
import { NotFound } from '@/errors/not-found'

type Store = {
  findOne(
    storeId: string,
  ): Promise<
    Either<NotFound, { data: Types.Models.Store.WithCityAndProducts; hasMore: boolean }>
  >
}

export { Store }

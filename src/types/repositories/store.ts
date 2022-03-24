import { Either } from 'fp-either'
import { Types } from '@/types'
import { NotFoundError } from '@/errors/not-found'

type Store = {
  findOne(
    storeId: string,
  ): Promise<
    Either<NotFoundError, { data: Types.Models.Store.WithCityAndProducts; hasMore: boolean }>
  >
}

export { Store }

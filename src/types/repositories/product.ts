import { Either } from 'fp-either'
import { Types } from '@/types'
import { NotFoundError } from '@/errors/not-found'

type Product = {
  findMany(page: number): Promise<{ data: Types.Models.Product.WithStore[]; hasMore: boolean }>
  findOne(productId: string): Promise<Either<NotFoundError, Types.Models.Product.WithStore>>
  findManyByStore(
    storeId: string,
    page: number,
  ): Promise<{ data: Types.Models.Product[]; hasMore: boolean }>
}

export { Product }

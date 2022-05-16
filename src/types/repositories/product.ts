import { Either } from 'fp-either'
import { Product } from '@/types/product'
import { Store } from '@/types/store'
import NotFoundError from '@/errors/not-found'

export type ProductRepository = {
  findMany(page: number): Promise<{
    data: (Product & { store: Store })[]
    hasMore: boolean
  }>
  findOne(productId: string): Promise<Either<NotFoundError, Product & { store: Store }>>
  findManyByStore(storeId: string, page: number): Promise<{ data: Product[]; hasMore: boolean }>
}

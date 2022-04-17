import { Either } from 'fp-either'
import { ProductModel } from '@/types/models/product'
import { StoreModel } from '@/types/models/store'
import NotFoundError from '@/errors/not-found'

export type ProductRepository = {
  findMany(
    page: number,
  ): Promise<{ data: (ProductModel & { store: StoreModel })[]; hasMore: boolean }>
  findOne(productId: string): Promise<Either<NotFoundError, ProductModel & { store: StoreModel }>>
  findManyByStore(
    storeId: string,
    page: number,
  ): Promise<{ data: ProductModel[]; hasMore: boolean }>
}

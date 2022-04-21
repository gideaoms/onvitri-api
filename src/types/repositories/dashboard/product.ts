import { Either } from 'fp-either'
import { Product } from '@/types/product'
import { Store } from '@/types/store'
import { City } from '@/types/city'
import NotFoundError from '@/errors/not-found'

// TODO: change from Promise<Either<User, Error>> to Promise<[User, Error?]>

export type ProductRepository = {
  findMany(
    ownerId: string,
    page: number,
  ): Promise<{
    data: (Product & { store: Store & { city: City } })[]
    hasMore: boolean
  }>
  create(product: Product): Promise<Product>
  exists(
    productId: string,
    ownerId: string,
  ): Promise<Either<NotFoundError, Product>>
  update(product: Product): Promise<Product>
  findOne(
    productId: string,
    ownerId: string,
  ): Promise<Either<NotFoundError, Product>>
}

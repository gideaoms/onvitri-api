import { Either } from 'fp-either'
import NotFoundError from '@/errors/not-found'
import { StoreModel } from '@/types/models/store'
import { CityModel } from '@/types/models/city'
import { ProductModel } from '@/types/models/product'

export type StoreRepository = {
  findOne(
    storeId: string,
  ): Promise<
    Either<
      NotFoundError,
      { data: StoreModel & { city: CityModel; products: ProductModel[] }; hasMore: boolean }
    >
  >
}

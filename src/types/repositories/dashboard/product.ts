import { ProductModel } from '@/types/models/product'
import { StoreModel } from '@/types/models/store'
import { CityModel } from '@/types/models/city'

export type ProductRepository = {
  findMany(
    ownerId: string,
    page: number,
  ): Promise<{
    data: (ProductModel & { store: StoreModel & { city: CityModel } })[]
    hasMore: boolean
  }>
  create(product: ProductModel): Promise<ProductModel>
}

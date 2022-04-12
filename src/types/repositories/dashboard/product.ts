import { Models } from '@/types/models'

export type Product = {
  findMany(
    ownerId: string,
    page: number,
  ): Promise<{ data: Models.Product.WithStore[]; hasMore: boolean }>
}

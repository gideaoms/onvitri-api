import { isLeft, left, right } from 'fp-either'
import { Providers } from '@/types/providers'
import { Repositories } from '@/types/repositories'

export function Product(
  guardianProvider: Providers.Guardian,
  storeRepository: Repositories.Dashboard.Store,
  productRepository: Repositories.Dashboard.Product,
) {
  async function findMany(page: number, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const products = await productRepository.findMany(ownerId, page)
    return right(products)
  }

  return {
    findMany,
  }
}

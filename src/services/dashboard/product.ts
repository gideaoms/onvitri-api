import { isLeft, left, right } from 'fp-either'
import { GuardianProvider } from '@/types/providers/guardian'
import { ProductRepository } from '@/types/repositories/dashboard/product'
import { StoreRepository } from '@/types/repositories/dashboard/store'
import { ProductModel } from '@/types/models/product'

function ProductService(
  guardianProvider: GuardianProvider,
  productRepository: ProductRepository,
  storeRepository: StoreRepository,
) {
  async function findMany(page: number, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const products = await productRepository.findMany(ownerId, page)
    return right(products)
  }

  async function create(
    data: { storeId: string; title: string; description: string; price: number },
    token?: string,
  ) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const store = await storeRepository.exists(data.storeId, ownerId)
    if (isLeft(store)) return left(store.left)
    const product: ProductModel = {
      id: undefined!,
      storeId: data.storeId,
      title: data.title,
      description: data.description,
      price: data.price,
      photos: [],
      status: 'inactive',
    }
    const createdProduct = await productRepository.create(product)
    return right(createdProduct)
  }

  return {
    findMany,
    create,
  }
}

export default ProductService

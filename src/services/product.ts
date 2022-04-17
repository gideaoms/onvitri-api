import { isLeft, left, right } from 'fp-either'
import { ProductRepository } from '@/types/repositories/product'
import { StoreRepository } from '@/types/repositories/store'

function ProductService(productRepository: ProductRepository, storeRepository: StoreRepository) {
  async function findMany(page: number) {
    const products = await productRepository.findMany(page)
    return products
  }

  async function findOne(productId: string) {
    const product = await productRepository.findOne(productId)
    return product
  }

  async function findManyByStore(storeId: string, page: number) {
    const store = await storeRepository.findOne(storeId)
    if (isLeft(store)) return left(store.left)
    const products = await productRepository.findManyByStore(storeId, page)
    return right(products)
  }

  return {
    findMany,
    findOne,
    findManyByStore,
  }
}

export default ProductService

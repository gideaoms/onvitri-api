import { isLeft, left, right } from 'fp-either';
import { ProductRepository } from '@/types/repositories/product';
import { StoreRepository } from '@/types/repositories/store';

export function ProductService(productRepository: ProductRepository, storeRepository: StoreRepository) {
  async function findMany(page: number) {
    return productRepository.findMany(page);
  }

  async function findOne(productId: string) {
    return productRepository.findOne(productId);
  }

  async function findManyByStore(storeId: string, page: number) {
    const store = await storeRepository.findOne(storeId);
    if (isLeft(store)) return left(store.left);
    const products = await productRepository.findManyByStore(storeId, page);
    return right(products);
  }

  return {
    findMany: findMany,
    findOne: findOne,
    findManyByStore: findManyByStore,
  };
}

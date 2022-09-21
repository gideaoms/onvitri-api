import { isFailure, failure, success } from '@/either';
import { IProductRepository } from '@/types/repositories/product';
import { IStoreRepository } from '@/types/repositories/store';

export function ProductService(
  productRepository: IProductRepository,
  storeRepository: IStoreRepository,
) {
  function findManyByCity(cityId: string, page: number) {
    return productRepository.findManyByCity(cityId, page);
  }

  function findOne(productId: string) {
    return productRepository.findOne(productId);
  }

  async function findManyByStore(storeId: string, page: number) {
    const store = await storeRepository.findOne(storeId);
    if (isFailure(store)) return failure(store.failure);
    const products = await productRepository.findManyByStore(storeId, page);
    return success(products);
  }

  return {
    findManyByCity: findManyByCity,
    findOne: findOne,
    findManyByStore: findManyByStore,
  };
}

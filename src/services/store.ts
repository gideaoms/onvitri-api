import { IStoreRepository } from '@/types/repositories/store';

export function StoreService(storeRepository: IStoreRepository) {
  function findOne(storeId: string) {
    return storeRepository.findOne(storeId);
  }

  function findManyByCity(cityId: string, page: number) {
    return storeRepository.findManyByCity(cityId, page);
  }

  return {
    findOne: findOne,
    findManyByCity: findManyByCity,
  };
}

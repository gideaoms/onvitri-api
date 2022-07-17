import { StoreRepository } from '@/types/repositories/store';

export function StoreService(storeRepository: StoreRepository) {
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

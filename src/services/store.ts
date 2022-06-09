import { StoreRepository } from '@/types/repositories/store';

export function StoreService(storeRepository: StoreRepository) {
  async function findOne(storeId: string) {
    return storeRepository.findOne(storeId);
  }

  return {
    findOne: findOne,
  };
}

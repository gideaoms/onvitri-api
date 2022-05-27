import { IStoreRepository } from '@/types/repositories/store';

function StoreService(storeRepository: IStoreRepository) {
  async function findOne(storeId: string) {
    const store = await storeRepository.findOne(storeId);
    return store;
  }

  return {
    findOne,
  };
}

export default StoreService;

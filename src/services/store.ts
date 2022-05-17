import { StoreRepository } from '@/types/repositories/store';

function StoreService(storeRepository: StoreRepository) {
  async function findOne(storeId: string) {
    const store = await storeRepository.findOne(storeId);
    return store;
  }

  return {
    findOne,
  };
}

export default StoreService;

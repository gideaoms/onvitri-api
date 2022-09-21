import { IStoreRepository } from '@/types/repositories/shopkeeper/store';
import { User } from '@/types/user';

export function StoreService(storeRepository: IStoreRepository) {
  function findMany(page: number, user: User) {
    const ownerId = user.id;
    return storeRepository.findMany(page, ownerId);
  }

  return {
    findMany: findMany,
  };
}

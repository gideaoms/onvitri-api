import { StoreRepository } from '@/types/repositories/dashboard/store';
import { User } from '@/types/user';

export function StoreService(storeRepository: StoreRepository) {
  function findAll(user: User) {
    const ownerId = user.id;
    return storeRepository.findAll(ownerId);
  }

  return {
    findAll: findAll,
  };
}

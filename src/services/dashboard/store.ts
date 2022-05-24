import { isLeft, left, right } from 'fp-either';
import { GuardianProvider } from '@/types/providers/guardian';
import { StoreRepository } from '@/types/repositories/dashboard/store';

function StoreService(guardianProvider: GuardianProvider, storeRepository: StoreRepository) {
  async function findAll(token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    const ownerId = user.right.id;
    const stores = await storeRepository.findAll(ownerId);
    return right(stores);
  }

  return {
    findAll,
  };
}

export default StoreService;

import { isLeft, left, right } from 'fp-either';
import { IGuardianProvider } from '@/types/providers/guardian';
import { IStoreRepository } from '@/types/repositories/dashboard/store';

function StoreService(guardianProvider: IGuardianProvider, storeRepository: IStoreRepository) {
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

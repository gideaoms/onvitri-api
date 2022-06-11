import { isLeft, isRight, left, right } from 'fp-either';
import { User } from '@/types/user';
import { StoreRepository } from '@/types/repositories/store';
import { FollowerRepository } from '@/types/repositories/follower';
import { BadRequestError } from '@/errors/bad-request';
import { Store } from '@/types/store';

export function FollowerService(storeRepository: StoreRepository, followerRepository: FollowerRepository) {
  async function create(storeId: string, user: User) {
    const userId = user.id;
    const status: Store.Status = 'active';
    const store = await storeRepository.exists(storeId, status);
    if (isLeft(store)) return left(store.left);
    const follower = await followerRepository.exists(storeId, userId);
    if (isRight(follower)) return left(new BadRequestError('You are already following this store'));
    await followerRepository.create(storeId, userId);
    return right(undefined);
  }

  async function remove(storeId: string, user: User) {
    const userId = user.id;
    const status: Store.Status = 'active';
    const store = await storeRepository.exists(storeId, status);
    if (isLeft(store)) return left(store.left);
    const follower = await followerRepository.exists(storeId, userId);
    if (isLeft(follower)) return left(new BadRequestError('You do not follow this store'));
    await followerRepository.remove(storeId, userId);
    return right(undefined);
  }

  return {
    create: create,
    remove: remove,
  };
}

import { left, right } from 'fp-either';
import { NotFoundError } from '@/errors/not-found';
import { FollowerRepository } from '@/types/repositories/follower';
import prisma from '@/libs/prisma';

export function FollowerRepository(): FollowerRepository {
  async function create(storeId: string, userId: string) {
    const follower = prisma.follower.create({
      data: {
        store_id: storeId,
        user_id: userId,
      },
    });
    const store = prisma.store.update({
      data: {
        followers_count: {
          increment: 1,
        },
      },
      where: {
        id: storeId,
      },
    });
    const user = prisma.user.update({
      data: {
        following_count: {
          increment: 1,
        },
      },
      where: {
        id: userId,
      },
    });
    await prisma.$transaction([follower, store, user]);
  }

  async function exists(storeId: string, userId: string) {
    const follower = await prisma.follower.findFirst({
      where: {
        store_id: storeId,
        user_id: userId,
      },
    });
    if (!follower) return left(new NotFoundError('Follower not found'));
    return right(undefined);
  }

  async function remove(storeId: string, userId: string) {
    const follower = prisma.follower.delete({
      where: {
        user_id_store_id: {
          store_id: storeId,
          user_id: userId,
        },
      },
    });
    const store = prisma.store.update({
      data: {
        followers_count: {
          decrement: 1,
        },
      },
      where: {
        id: storeId,
      },
    });
    const user = prisma.user.update({
      data: {
        following_count: {
          decrement: 1,
        },
      },
      where: {
        id: userId,
      },
    });
    await prisma.$transaction([follower, store, user]);
  }

  return {
    create: create,
    exists: exists,
    remove: remove,
  };
}

import { left, right } from 'fp-either';
import prisma from '@/libs/prisma';
import { UserRepository } from '@/types/repositories/user';
import { UserRecord } from '@/types/records/user';
import { UserMapper } from '@/mappers/user';
import { NotFoundError } from '@/errors/not-found';

export function UserRepository(): UserRepository {
  const userMapper = UserMapper();

  async function findOneByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) return left(new NotFoundError('User not found'));
    return right(
      userMapper.fromRecord({
        ...user,
        token: '',
        roles: user.roles as UserRecord.Role[],
        status: user.status as UserRecord.Status,
      }),
    );
  }

  async function findOneById(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) return left(new NotFoundError('User not found'));
    return right(
      userMapper.fromRecord({
        ...user,
        token: '',
        roles: user.roles as UserRecord.Role[],
        status: user.status as UserRecord.Status,
      }),
    );
  }

  return {
    findOneByEmail: findOneByEmail,
    findOneById: findOneById,
  };
}

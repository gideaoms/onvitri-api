import { left, right } from 'fp-either';
import prisma from '@/libs/prisma';
import { UserRepository } from '@/types/repositories/user';
import { UserRecord } from '@/types/records/user';
import { UserMapper } from '@/mappers/user';
import { NotFoundError } from '@/errors/not-found';
import { User } from '@/types/user';

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
        roles: user.roles as UserRecord.Role[],
        status: user.status as UserRecord.Status,
      }),
    );
  }

  async function update(user: User) {
    const updated = await prisma.user.update({
      data: userMapper.toRecord(user),
      where: {
        id: user.id,
      },
    });
    return userMapper.fromRecord({
      ...updated,
      roles: user.roles as UserRecord.Role[],
      status: user.status as UserRecord.Status,
    });
  }

  async function create(user: User) {
    const created = await prisma.user.create({
      data: userMapper.toRecord(user),
    });
    return userMapper.fromRecord({
      ...created,
      roles: user.roles as UserRecord.Role[],
      status: user.status as UserRecord.Status,
    });
  }

  return {
    findOneByEmail: findOneByEmail,
    findOneById: findOneById,
    update: update,
    create: create,
  };
}

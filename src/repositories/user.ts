import { left, right } from 'fp-either';
import { IUserRepository } from '@/types/repositories/user';
import { UserRecord } from '@/types/records/user';
import UserMapper from '@/mappers/user';
import prisma from '@/libs/prisma';
import NotFoundError from '@/errors/not-found';

function UserRepository(): IUserRepository {
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
    findOneByEmail,
    findOneById,
  };
}

export default UserRepository;

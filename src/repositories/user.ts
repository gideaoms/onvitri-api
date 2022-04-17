import { left, right } from 'fp-either'
import { UserRepository } from '@/types/repositories/user'
import UserMapper from '@/mappers/user'
import prisma from '@/libs/prisma'
import NotFoundError from '@/errors/not-found'

function UserRepository(): UserRepository {
  const userMapper = UserMapper()

  async function findOneByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })
    if (!user) return left(new NotFoundError('User not found'))
    return right(userMapper.fromRecord(user as any))
  }

  async function findOneById(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })
    if (!user) return left(new NotFoundError('User not found'))
    return right(userMapper.fromRecord(user as any))
  }

  return {
    findOneByEmail,
    findOneById,
  }
}

export default UserRepository

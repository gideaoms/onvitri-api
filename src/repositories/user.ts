import { left, right } from 'fp-either'
import { prisma } from '@/libs/prisma'
import { Types } from '@/types'
import { Errors } from '@/errors'
import { Mappers } from '@/mappers'

function User(): Types.Repositories.User {
  const userMapper = Mappers.User()

  async function findOneByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })
    if (!user) return left(new Errors.NotFound('User not found'))
    return right(userMapper.fromRecord(user as any))
  }

  async function findOneById(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })
    if (!user) return left(new Errors.NotFound('User not found'))
    return right(userMapper.fromRecord(user as any))
  }

  return {
    findOneByEmail,
    findOneById,
  }
}

export { User }

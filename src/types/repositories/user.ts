import { Either } from 'fp-either'
import { Types } from '@/types'
import { NotFound } from '@/errors/not-found'

type User = {
  findOneByEmail(email: string): Promise<Either<NotFound, Types.Models.User>>
  findOneById(userId: string): Promise<Either<NotFound, Types.Models.User>>
}

export { User }

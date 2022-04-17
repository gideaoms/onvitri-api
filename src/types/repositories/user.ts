import { Either } from 'fp-either'
import { UserModel } from '@/types/models/user'
import NotFoundError from '@/errors/not-found'

export type UserRepository = {
  findOneByEmail(email: string): Promise<Either<NotFoundError, UserModel>>
  findOneById(userId: string): Promise<Either<NotFoundError, UserModel>>
}

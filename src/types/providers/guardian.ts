import { Either } from 'fp-either'
import { UserModel } from '@/types/models/user'
import UnauthorizedError from '@/errors/unauthorized'

export type GuardianProvider = {
  passThrough(role: UserModel.Role, token?: string): Promise<Either<UnauthorizedError, UserModel>>
}

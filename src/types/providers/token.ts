import { Either } from 'fp-either'
import UnauthorizedError from '@/errors/unauthorized'

export type TokenProvider = {
  generate(sub: string): string
  verify(token: string): Either<UnauthorizedError, string>
}

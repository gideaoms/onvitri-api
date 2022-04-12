import { Either } from 'fp-either'
import { Unauthorized } from '@/errors/unauthorized'

type Token = {
  generate(sub: string): string
  verify(token: string): Either<Unauthorized, string>
}

export { Token }

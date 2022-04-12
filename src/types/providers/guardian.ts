import { Either } from 'fp-either'
import { Types } from '@/types'
import { Unauthorized } from '@/errors/unauthorized'

type Guardian = {
  passThrough(
    role: Types.Models.User.Role,
    token?: string,
  ): Promise<Either<Unauthorized, Types.Models.User>>
}

export { Guardian }

import { isLeft, left, right } from 'fp-either'
import { Types } from '@/types'
import { Models } from '@/models'
import { Errors } from '@/errors'

function Guardian(
  tokenProvider: Types.Providers.Token,
  userRepository: Types.Repositories.User,
  cryptoProvider: Types.Providers.Crypto,
) {
  const userModel = Models.User(cryptoProvider)

  async function passThrough(role: Types.Models.User.Role, token?: string) {
    if (!token) return left(new Errors.Unauthorized('Unauthorized'))
    const [, rawToken] = token.split(' ')
    if (!rawToken) return left(new Errors.Unauthorized('Unauthorized'))
    const sub = tokenProvider.verify(rawToken)
    if (isLeft(sub)) return left(new Errors.Unauthorized('Unauthorized'))
    const user = await userRepository.findOneById(sub.right)
    if (isLeft(user)) return left(new Errors.Unauthorized('Unauthorized'))
    if (!userModel.isActive(user.right))
      return left(new Errors.Unauthorized('O seu perfil não está ativo na plataforma'))
    if (!userModel.hasRole(user.right, role)) return left(new Errors.Unauthorized('Unauthorized'))
    return right({ ...user.right, token: rawToken })
  }

  return {
    passThrough,
  }
}

export { Guardian }

import { isLeft, left, right } from 'fp-either'
import { Types } from '@/types'
import { Errors } from '@/errors'
import { Models } from '@/models'

function Session(
  userRepository: Types.Repositories.User,
  cryptoProvider: Types.Providers.Crypto,
  tokenProvider: Types.Providers.Token,
  guardianProvider: Types.Providers.Guardian,
) {
  const userModel = Models.User(cryptoProvider)

  async function create(email: string, plainPassword: string) {
    const message = 'Email e/ou senha incorretos'
    const foundUser = await userRepository.findOneByEmail(email)
    if (isLeft(foundUser)) return left(new Errors.BadRequest(message))
    const hashedPassword = foundUser.right.password
    const isPasswordCorrect = await userModel.isPasswordCorrect(plainPassword, hashedPassword)
    if (!isPasswordCorrect) return left(new Errors.BadRequest(message))
    const sub = foundUser.right.id
    const token = tokenProvider.generate(sub)
    return right({ ...foundUser.right, token: token })
  }

  async function findOne(token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    return user
  }

  return {
    create,
    findOne,
  }
}

export { Session }

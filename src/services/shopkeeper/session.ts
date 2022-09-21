import { isFailure, failure, success } from '@/either';
import { IUserRepository } from '@/types/repositories/shopkeeper/user';
import { ICryptoProvider } from '@/types/providers/crypto';
import { BadRequestError } from '@/errors/bad-request';
import { ITokenProvider } from '@/types/providers/token';

export function SessionService(
  userRepository: IUserRepository,
  cryptoProvider: ICryptoProvider,
  tokenProvider: ITokenProvider,
) {
  async function create(email: string, plainPassword: string) {
    const message = 'Email e/ou senha incorretos';
    const user = await userRepository.findOneByEmail(email);
    if (isFailure(user)) {
      return failure(new BadRequestError(message));
    }
    const hashedPassword = user.success.password;
    const isPasswordCorrect = await cryptoProvider.compare(plainPassword, hashedPassword);
    if (!isPasswordCorrect) {
      return failure(new BadRequestError(message));
    }
    const sub = user.success.id;
    const token = tokenProvider.generate(sub);
    return success({ ...user.success, token: token });
  }

  return {
    create: create,
  };
}

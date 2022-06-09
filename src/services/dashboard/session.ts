import { isLeft, left, right } from 'fp-either';
import { UserRepository } from '@/types/repositories/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { TokenProvider } from '@/types/providers/token';
import { UserModel } from '@/models/user';
import { BadRequestError } from '@/errors/bad-request';

export function SessionService(
  userRepository: UserRepository,
  cryptoProvider: CryptoProvider,
  tokenProvider: TokenProvider,
) {
  const userModel = UserModel(cryptoProvider);

  async function create(email: string, plainPassword: string) {
    const message = 'Email e/ou senha incorretos';
    const foundUser = await userRepository.findOneByEmail(email);
    if (isLeft(foundUser)) return left(new BadRequestError(message));
    const hashedPassword = foundUser.right.password;
    const isPasswordCorrect = await userModel.isPasswordCorrect(plainPassword, hashedPassword);
    if (!isPasswordCorrect) return left(new BadRequestError(message));
    const sub = foundUser.right.id;
    const token = tokenProvider.generate(sub);
    return right({ ...foundUser.right, token: token });
  }

  return {
    create: create,
  };
}

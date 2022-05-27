import { isLeft, left, right } from 'fp-either';
import { IUserRepository } from '@/types/repositories/user';
import { ICryptoProvider } from '@/types/providers/crypto';
import { ITokenProvider } from '@/types/providers/token';
import { IGuardianProvider } from '@/types/providers/guardian';
import UserModel from '@/models/user';
import BadRequestError from '@/errors/bad-request';

function SessionService(
  userRepository: IUserRepository,
  cryptoProvider: ICryptoProvider,
  tokenProvider: ITokenProvider,
  guardianProvider: IGuardianProvider,
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

  async function findOne(token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    return user;
  }

  return {
    create,
    findOne,
  };
}

export default SessionService;

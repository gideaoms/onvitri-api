import { isLeft, isRight, left, right } from 'fp-either';
import { UserRepository } from '@/types/repositories/user';
import { NewSessionJob } from '@/types/jobs/new-session';
import { CryptoProvider } from '@/types/providers/crypto';
import { User } from '@/types/user';
import { UserModel } from '@/models/user';
import { BadRequestError } from '@/errors/bad-request';
import { TokenProvider } from '@/types/providers/token';

export function SessionService(
  userRepository: UserRepository,
  newSessionJob: NewSessionJob,
  cryptoProvider: CryptoProvider,
  tokenProvider: TokenProvider,
) {
  const userModel = UserModel(cryptoProvider);

  async function create(email: string) {
    const user = await userRepository.findOneByEmail(email);
    if (isRight(user)) {
      if (!userModel.isActive(user.right))
        return left(new BadRequestError('O email informado não está ativo em nossa plataforma'));
      const emailCode = cryptoProvider.randomDigits();
      const newUser: User = { ...user.right, emailCode: emailCode };
      await userRepository.update(newUser);
      newSessionJob.addToQueue(user.right.name, user.right.email, emailCode);
    }
    return right(undefined);
  }

  async function activate(email: string, emailCode: string) {
    const message = 'Email e/ou código inválidos';
    const user = await userRepository.findOneByEmail(email);
    if (isLeft(user)) return left(new BadRequestError(message));
    if (!userModel.isEmailCodeValid(user.right, emailCode)) return left(new BadRequestError(message));
    const userToUpdate: User = { ...user.right, emailCode: null };
    const updatedUser = await userRepository.update(userToUpdate);
    const sub = updatedUser.id;
    const token = tokenProvider.generate(sub);
    return right({ ...updatedUser, token: token });
  }

  return {
    create: create,
    activate: activate,
  };
}

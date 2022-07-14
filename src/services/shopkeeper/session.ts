import { isFailure, isSuccess, failure, success } from '@/either';
import { UserRepository } from '@/types/repositories/shopkeeper/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { UserModel } from '@/models/user';
import { BadRequestError } from '@/errors/bad-request';
import { User } from '@/types/user';
import { NewSessionJob } from '@/types/jobs/new-session';
import { TokenProvider } from '@/types/providers/token';

export function SessionService(
  userRepository: UserRepository,
  cryptoProvider: CryptoProvider,
  tokenProvider: TokenProvider,
  newSessionJob: NewSessionJob,
) {
  const userModel = UserModel(cryptoProvider);

  async function create(email: string) {
    const user = await userRepository.findOneByEmail(email);
    if (isSuccess(user) && userModel.hasRole(user.success, 'shopkeeper')) {
      if (!userModel.isActive(user.success))
        return failure(new BadRequestError('O email informado não está ativo em nossa plataforma'));
      const emailCode = cryptoProvider.randomDigits();
      const newUser: User = { ...user.success, emailCode: emailCode };
      await userRepository.update(newUser);
      newSessionJob.addToQueue(user.success.name, user.success.email, emailCode);
    }
    return success(undefined);
  }

  async function activate(email: string, emailCode: string) {
    const message = 'Email e/ou código inválidos';
    const user = await userRepository.findOneByEmail(email);
    if (isFailure(user)) return failure(new BadRequestError(message));
    if (!userModel.isEmailCodeValid(user.success, emailCode)) return failure(new BadRequestError(message));
    const userToUpdate: User = { ...user.success, emailCode: null };
    const updatedUser = await userRepository.update(userToUpdate);
    const sub = updatedUser.id;
    const token = tokenProvider.generate(sub);
    return success({ ...updatedUser, token: token });
  }

  return {
    create: create,
    activate: activate,
  };
}

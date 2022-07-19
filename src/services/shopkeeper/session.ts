import { isFailure, isSuccess, failure, success } from '@/either';
import { UserRepository } from '@/types/repositories/shopkeeper/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { UserModel } from '@/models/user';
import { BadRequestError } from '@/errors/bad-request';
import { User } from '@/types/user';
import { TokenProvider } from '@/types/providers/token';
import { NewSessionMailer } from '@/types/mailers/new-session';

export function SessionService(
  userRepository: UserRepository,
  cryptoProvider: CryptoProvider,
  tokenProvider: TokenProvider,
  newSessionMailer: NewSessionMailer,
) {
  const userModel = UserModel(cryptoProvider);

  async function create(email: string) {
    const user = await userRepository.findOneByEmail(email);
    if (isSuccess(user) && userModel.hasRole(user.success, 'shopkeeper')) {
      if (!userModel.isActive(user.success))
        return failure(new BadRequestError('O email informado não está ativo em nossa plataforma'));
      const validationCode = cryptoProvider.randomDigits();
      const newUser: User = { ...user.success, validationCode: validationCode };
      await newSessionMailer.send(newUser.name, newUser.email, validationCode);
      await userRepository.update(newUser);
    }
    return success(undefined);
  }

  async function activate(email: string, validationCode: string) {
    const message = 'Email e/ou código inválidos';
    const user = await userRepository.findOneByEmail(email);
    if (isFailure(user)) return failure(new BadRequestError(message));
    if (!userModel.isValidationCodeValid(user.success, validationCode)) return failure(new BadRequestError(message));
    const userToUpdate: User = { ...user.success, validationCode: null };
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

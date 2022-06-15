import { isLeft, isRight, left, right } from 'fp-either';
import { UserRepository } from '@/types/repositories/user';
import { User } from '@/types/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { UserModel } from '@/models/user';
import { NewUserJob } from '@/types/jobs/new-user';
import { BadRequestError } from '@/errors/bad-request';

export function UserService(userRepository: UserRepository, cryptoProvider: CryptoProvider, newUserJob: NewUserJob) {
  const userModel = UserModel(cryptoProvider);

  async function create(name: string, email: string) {
    const emailCode = cryptoProvider.randomDigits();
    const existingUser = await userRepository.findOneByEmail(email);
    if (isRight(existingUser) && userModel.isAwaiting(existingUser.right)) {
      const userToUpdate: User = {
        ...existingUser.right,
        name: name,
        emailCode: emailCode,
      };
      const updatedUser = await userRepository.update(userToUpdate);
      newUserJob.addToQueue(updatedUser.name, updatedUser.email, emailCode);
      return right(updatedUser);
    }
    if (isRight(existingUser))
      return left(new BadRequestError('O email informado já está sendo usado em nossa plataforma'));
    const userToCreate: User = {
      id: undefined!,
      name: name,
      email: email,
      emailCode: emailCode,
      password: undefined!,
      roles: ['consumer'],
      status: 'awaiting',
      token: '',
    };
    const createdUser = await userRepository.create(userToCreate);
    newUserJob.addToQueue(createdUser.name, createdUser.email, emailCode);
    return right(createdUser);
  }

  async function activate(email: string, emailCode: string) {
    const user = await userRepository.findOneByEmailAndEmailCode(email, emailCode);
    if (isLeft(user)) return left(user.left);
    const userToUpdate: User = { ...user.right, status: 'active', emailCode: null };
    const updatedUser = await userRepository.update(userToUpdate);
    return right(updatedUser);
  }

  return {
    create: create,
    activate: activate,
  };
}

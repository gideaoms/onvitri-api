import { isRight } from 'fp-either';
import { UserRepository } from '@/types/repositories/user';
import { User } from '@/types/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { UserModel } from '@/models/user';
import { NewUserJob } from '@/types/jobs/new-user';

export function UserService(userRepository: UserRepository, cryptoProvider: CryptoProvider, newUserJob: NewUserJob) {
  const userModel = UserModel(cryptoProvider);

  async function create(name: string, email: string) {
    const size = 6;
    const emailCode = cryptoProvider.random(size);
    const existingUser = await userRepository.findOneByEmail(email);
    if (isRight(existingUser) && userModel.isAwaiting(existingUser.right)) {
      const userToUpdate: User = {
        ...existingUser.right,
        name: name,
        emailCode: emailCode,
      };
      const updatedUser = await userRepository.update(userToUpdate);
      newUserJob.addToQueue(updatedUser.name, updatedUser.email, emailCode);
      return updatedUser;
    }
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
    return createdUser;
  }

  return {
    create: create,
  };
}

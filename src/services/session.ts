import { isRight } from 'fp-either';
import { UserRepository } from '@/types/repositories/user';
import { NewSessionJob } from '@/types/jobs/new-session';
import { CryptoProvider } from '@/types/providers/crypto';
import { User } from '@/types/user';

export function SessionService(
  userRepository: UserRepository,
  newSessionJob: NewSessionJob,
  cryptoProvider: CryptoProvider,
) {
  async function create(email: string) {
    const user = await userRepository.findOneByEmail(email);
    if (isRight(user)) {
      const size = 6;
      const emailCode = cryptoProvider.random(size);
      const newUser: User = { ...user.right, emailCode: emailCode };
      await userRepository.update(newUser);
      newSessionJob.addToQueue(user.right.name, user.right.email, emailCode);
    }
  }

  return {
    create: create,
  };
}
